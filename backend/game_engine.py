import random
import asyncio
from typing import List, Dict, Optional, Tuple
from models import GameState, Player, Property, Card, TradeOffer
from data.properties import PROPERTIES, CHANCE_CARDS, COMMUNITY_CHEST_CARDS
import logging

logger = logging.getLogger(__name__)

class MonopolyGameEngine:
    def __init__(self):
        self.games: Dict[str, GameState] = {}
        self.trades: Dict[str, TradeOffer] = {}

    def create_game(self, room_code: str, players: List[Player]) -> GameState:
        """Create a new game state"""
        # Initialize properties
        properties = [Property(**prop) for prop in PROPERTIES]
        
        # Initialize cards
        chance_cards = [Card(**card) for card in CHANCE_CARDS]
        community_chest_cards = [Card(**card) for card in COMMUNITY_CHEST_CARDS]
        
        # Shuffle cards
        random.shuffle(chance_cards)
        random.shuffle(community_chest_cards)
        
        game_state = GameState(
            room_code=room_code,
            players=players,
            properties=properties,
            chance_cards=chance_cards,
            community_chest_cards=community_chest_cards,
            game_log=[f"Game started with {len(players)} players"]
        )
        
        self.games[room_code] = game_state
        return game_state

    def get_game(self, room_code: str) -> Optional[GameState]:
        """Get game state for a room"""
        return self.games.get(room_code)

    def roll_dice(self, room_code: str, player_id: str) -> Tuple[int, int, int]:
        """Roll dice for a player"""
        game = self.games.get(room_code)
        if not game:
            raise ValueError("Game not found")
        
        current_player = game.players[game.current_player]
        if current_player.id != player_id:
            raise ValueError("Not your turn")
        
        if game.turn_phase != "roll":
            raise ValueError("Cannot roll dice in current phase")
        
        dice1 = random.randint(1, 6)
        dice2 = random.randint(1, 6)
        total = dice1 + dice2
        
        game.dice_values = [dice1, dice2]
        game.turn_phase = "move"
        
        # Handle doubles
        doubles_count = getattr(current_player, 'doubles_count', 0)
        if dice1 == dice2:
            doubles_count += 1
            current_player.doubles_count = doubles_count
            
            # Three doubles in a row = go to jail
            if doubles_count >= 3:
                self.send_to_jail(room_code, player_id)
                game.turn_phase = "endTurn"
                current_player.doubles_count = 0
        else:
            current_player.doubles_count = 0
        
        game.game_log.append(f"{current_player.name} rolled {dice1}+{dice2}={total}")
        return dice1, dice2, total

    def move_player(self, room_code: str, player_id: str, spaces: int) -> int:
        """Move a player on the board"""
        game = self.games.get(room_code)
        if not game:
            raise ValueError("Game not found")
        
        player = next((p for p in game.players if p.id == player_id), None)
        if not player:
            raise ValueError("Player not found")
        
        old_position = player.position
        new_position = (old_position + spaces) % 40
        
        # Check if player passed GO
        if new_position < old_position or (old_position == 0 and spaces > 0):
            player.money += 2000
            game.game_log.append(f"{player.name} passed GO and collected ₹2000")
        
        player.position = new_position
        game.turn_phase = "action"
        
        game.game_log.append(f"{player.name} moved from {old_position} to {new_position}")
        return new_position

    def buy_property(self, room_code: str, player_id: str, property_id: int) -> bool:
        """Buy a property"""
        game = self.games.get(room_code)
        if not game:
            raise ValueError("Game not found")
        
        player = next((p for p in game.players if p.id == player_id), None)
        if not player:
            raise ValueError("Player not found")
        
        property_obj = next((p for p in game.properties if p.id == property_id), None)
        if not property_obj:
            raise ValueError("Property not found")
        
        if property_obj.owner:
            raise ValueError("Property already owned")
        
        if not property_obj.price:
            raise ValueError("Property not for sale")
        
        if player.money < property_obj.price:
            raise ValueError("Insufficient funds")
        
        # Complete purchase
        player.money -= property_obj.price
        player.properties.append(property_id)
        property_obj.owner = player_id
        
        game.game_log.append(f"{player.name} bought {property_obj.name} for ₹{property_obj.price}")
        return True

    def pay_rent(self, room_code: str, player_id: str, property_id: int) -> int:
        """Pay rent for landing on a property"""
        game = self.games.get(room_code)
        if not game:
            raise ValueError("Game not found")
        
        player = next((p for p in game.players if p.id == player_id), None)
        property_obj = next((p for p in game.properties if p.id == property_id), None)
        
        if not player or not property_obj or not property_obj.owner:
            return 0
        
        owner = next((p for p in game.players if p.id == property_obj.owner), None)
        if not owner or owner.id == player_id:
            return 0
        
        # Calculate rent
        rent = self.calculate_rent(property_obj, game)
        
        if player.money >= rent:
            player.money -= rent
            owner.money += rent
            game.game_log.append(f"{player.name} paid ₹{rent} rent to {owner.name}")
        else:
            # Player is bankrupt
            self.handle_bankruptcy(game, player, owner)
        
        return rent

    def calculate_rent(self, property_obj: Property, game: GameState) -> int:
        """Calculate rent for a property"""
        if property_obj.mortgaged:
            return 0
        
        if property_obj.type == "railroad":
            # Count railroads owned by same player
            railroads_owned = sum(1 for p in game.properties 
                                if p.type == "railroad" and p.owner == property_obj.owner)
            return property_obj.rent[railroads_owned - 1] if property_obj.rent else 0
        
        elif property_obj.type == "utility":
            # Utility rent based on dice roll
            utilities_owned = sum(1 for p in game.properties 
                                if p.type == "utility" and p.owner == property_obj.owner)
            multiplier = 10 if utilities_owned == 2 else 4
            return sum(game.dice_values) * multiplier
        
        elif property_obj.type == "property" and property_obj.rent:
            if property_obj.hotel:
                return property_obj.rent[5]  # Hotel rent
            elif property_obj.houses > 0:
                return property_obj.rent[property_obj.houses]  # House rent
            else:
                # Check if player owns all properties in group
                group_properties = [p for p in game.properties 
                                  if p.group == property_obj.group and p.type == "property"]
                owns_all = all(p.owner == property_obj.owner for p in group_properties)
                base_rent = property_obj.rent[0]
                return base_rent * 2 if owns_all else base_rent
        
        return 0

    def draw_chance_card(self, room_code: str, player_id: str) -> Card:
        """Draw a chance card"""
        game = self.games.get(room_code)
        if not game or not game.chance_cards:
            raise ValueError("No chance cards available")
        
        card = game.chance_cards.pop(0)
        game.chance_cards.append(card)  # Put it back at the end
        
        # Execute card effect
        self.execute_card_effect(game, player_id, card)
        
        return card

    def draw_community_chest_card(self, room_code: str, player_id: str) -> Card:
        """Draw a community chest card"""
        game = self.games.get(room_code)
        if not game or not game.community_chest_cards:
            raise ValueError("No community chest cards available")
        
        card = game.community_chest_cards.pop(0)
        game.community_chest_cards.append(card)  # Put it back at the end
        
        # Execute card effect
        self.execute_card_effect(game, player_id, card)
        
        return card

    def execute_card_effect(self, game: GameState, player_id: str, card: Card):
        """Execute the effect of a drawn card"""
        player = next((p for p in game.players if p.id == player_id), None)
        if not player:
            return
        
        if card.type == "collect":
            player.money += card.amount or 0
            game.game_log.append(f"{player.name} collected ₹{card.amount}")
        
        elif card.type == "pay":
            player.money -= card.amount or 0
            game.game_log.append(f"{player.name} paid ₹{card.amount}")
        
        elif card.type == "move":
            if card.position is not None:
                old_position = player.position
                player.position = card.position
                if card.collect_go and card.position < old_position:
                    player.money += 2000
                    game.game_log.append(f"{player.name} passed GO and collected ₹2000")
                game.game_log.append(f"{player.name} moved to {card.position}")
        
        elif card.type == "goToJail":
            self.send_to_jail(game.room_code, player_id)
        
        elif card.type == "jailFree":
            player.get_out_of_jail_cards += 1
            game.game_log.append(f"{player.name} received a Get Out of Jail Free card")

    def send_to_jail(self, room_code: str, player_id: str):
        """Send a player to jail"""
        game = self.games.get(room_code)
        if not game:
            return
        
        player = next((p for p in game.players if p.id == player_id), None)
        if not player:
            return
        
        player.position = 10  # Jail position
        player.in_jail = True
        player.jail_turns = 0
        game.game_log.append(f"{player.name} was sent to jail")

    def end_turn(self, room_code: str, player_id: str):
        """End current player's turn"""
        game = self.games.get(room_code)
        if not game:
            raise ValueError("Game not found")
        
        current_player = game.players[game.current_player]
        if current_player.id != player_id:
            raise ValueError("Not your turn")
        
        # Check for doubles
        if hasattr(current_player, 'doubles_count') and current_player.doubles_count > 0 and not current_player.in_jail:
            # Player gets another turn
            game.turn_phase = "roll"
            game.game_log.append(f"{current_player.name} rolled doubles and gets another turn")
        else:
            # Move to next player
            game.current_player = (game.current_player + 1) % len(game.players)
            game.turn_phase = "roll"
            next_player = game.players[game.current_player]
            game.game_log.append(f"It's now {next_player.name}'s turn")

    def handle_bankruptcy(self, game: GameState, bankrupt_player: Player, creditor: Player):
        """Handle player bankruptcy"""
        # Transfer all properties to creditor
        for property_id in bankrupt_player.properties:
            property_obj = next((p for p in game.properties if p.id == property_id), None)
            if property_obj:
                property_obj.owner = creditor.id
                creditor.properties.append(property_id)
        
        # Transfer money
        creditor.money += max(0, bankrupt_player.money)
        
        # Remove player from game
        game.players.remove(bankrupt_player)
        
        # Adjust current player index
        if game.current_player >= len(game.players):
            game.current_player = 0
        
        game.game_log.append(f"{bankrupt_player.name} went bankrupt")
        
        # Check for winner
        if len(game.players) == 1:
            game.winner = game.players[0].id
            game.game_ended = True
            game.game_log.append(f"{game.players[0].name} wins the game!")

# Global game engine instance
game_engine = MonopolyGameEngine()