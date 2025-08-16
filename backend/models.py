from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class Player(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    avatar: str
    money: int = 15000
    position: int = 0
    properties: List[int] = []
    in_jail: bool = False
    jail_turns: int = 0
    color: str
    is_host: bool = False
    ready: bool = False
    connected: bool = True
    get_out_of_jail_cards: int = 0

class Property(BaseModel):
    id: int
    name: str
    type: str
    color: Optional[str] = None
    price: Optional[int] = None
    rent: Optional[List[int]] = None
    group: Optional[str] = None
    description: str
    owner: Optional[str] = None
    mortgaged: bool = False
    houses: int = 0
    hotel: bool = False

class Card(BaseModel):
    id: int
    title: str
    description: str
    type: str
    amount: Optional[int] = None
    position: Optional[int] = None
    collect_go: Optional[bool] = None
    from_all: Optional[bool] = None
    target: Optional[str] = None
    pay_double: Optional[bool] = None
    house: Optional[int] = None
    hotel: Optional[int] = None
    spaces: Optional[int] = None

class TradeOffer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_player_id: str
    to_player_id: str
    from_properties: List[int] = []
    to_properties: List[int] = []
    from_money: int = 0
    to_money: int = 0
    status: str = "pending"  # pending, accepted, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Room(BaseModel):
    code: str = Field(default_factory=lambda: f"ROOM{uuid.uuid4().hex[:6].upper()}")
    host_id: str
    players: List[Player] = []
    max_players: int = 6
    game_started: bool = False
    settings: Dict[str, Any] = {
        "starting_money": 15000,
        "house_limit": 32,
        "hotel_limit": 12
    }
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GameState(BaseModel):
    room_code: str
    current_player: int = 0
    players: List[Player] = []
    dice_values: List[int] = [1, 1]
    turn_phase: str = "roll"  # roll, move, action, trade, endTurn
    properties: List[Property] = []
    chance_cards: List[Card] = []
    community_chest_cards: List[Card] = []
    game_log: List[str] = []
    winner: Optional[str] = None
    game_started: bool = False
    game_ended: bool = False
    houses_remaining: int = 32
    hotels_remaining: int = 12

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    room_code: str
    player_id: str
    player_name: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)