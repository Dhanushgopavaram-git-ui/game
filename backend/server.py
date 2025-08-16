from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uuid
from datetime import datetime

# Import our models and game engine
from models import Room, GameState, Player, ChatMessage
from websocket_manager import manager
from game_engine import game_engine

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Indian Heritage Monopoly", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# In-memory storage for rooms and games (could be moved to database)
rooms: Dict[str, Room] = {}
players_data: Dict[str, Player] = {}

# Basic Models
class CreateRoomRequest(BaseModel):
    player_name: str
    avatar: str

class JoinRoomRequest(BaseModel):
    room_code: str
    player_name: str
    avatar: str

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Indian Heritage Monopoly API", "status": "running"}

@api_router.get("/rooms")
async def get_rooms():
    """Get list of available rooms"""
    return {"rooms": [room.dict() for room in rooms.values() if not room.game_started]}

@api_router.get("/rooms/{room_code}")
async def get_room(room_code: str):
    """Get specific room details"""
    if room_code not in rooms:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"room": rooms[room_code].dict()}

@api_router.get("/game/{room_code}/state")
async def get_game_state(room_code: str):
    """Get current game state"""
    game = game_engine.get_game(room_code)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"game_state": game.dict()}

# WebSocket endpoint
@app.websocket("/ws/{room_code}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, room_code: str, player_id: str):
    await manager.connect(websocket, room_code, player_id)
    
    # Update player connection status
    if player_id in players_data:
        players_data[player_id].connected = True
        await manager.broadcast_to_room({
            "type": "player-reconnected",
            "player_id": player_id
        }, room_code)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await handle_websocket_message(websocket, room_code, player_id, message)
    
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        
        # Update player connection status
        if player_id in players_data:
            players_data[player_id].connected = False
            await manager.broadcast_to_room({
                "type": "player-disconnected",
                "player_id": player_id
            }, room_code)

async def handle_websocket_message(websocket: WebSocket, room_code: str, player_id: str, message: dict):
    """Handle incoming WebSocket messages"""
    message_type = message.get("type")
    
    try:
        if message_type == "create-room":
            await handle_create_room(websocket, message)
        
        elif message_type == "join-room":
            await handle_join_room(websocket, message)
        
        elif message_type == "player-ready":
            await handle_player_ready(room_code, player_id, message)
        
        elif message_type == "start-game":
            await handle_start_game(room_code, player_id)
        
        elif message_type == "roll-dice":
            await handle_roll_dice(room_code, player_id)
        
        elif message_type == "buy-property":
            await handle_buy_property(room_code, player_id, message)
        
        elif message_type == "end-turn":
            await handle_end_turn(room_code, player_id)
        
        elif message_type == "send-chat":
            await handle_chat_message(room_code, player_id, message)
        
        elif message_type == "leave-room":
            await handle_leave_room(room_code, player_id)
    
    except Exception as e:
        logger.error(f"Error handling message {message_type}: {e}")
        await manager.send_personal_message({
            "type": "error",
            "message": str(e)
        }, player_id)

async def handle_create_room(websocket: WebSocket, message: dict):
    """Handle room creation"""
    player_name = message.get("player_name")
    avatar = message.get("avatar", "👑")
    
    # Create new room
    room_code = f"ROOM{uuid.uuid4().hex[:6].upper()}"
    
    # Create player
    player = Player(
        name=player_name,
        avatar=avatar,
        color="#DC2626",
        is_host=True,
        ready=True
    )
    
    # Create room
    room = Room(
        code=room_code,
        host_id=player.id,
        players=[player]
    )
    
    # Store room and player data
    rooms[room_code] = room
    players_data[player.id] = player
    
    # Send response
    await manager.send_personal_message({
        "type": "room-created",
        "room_code": room_code,
        "player_id": player.id,
        "room": room.dict()
    }, player.id)

async def handle_join_room(websocket: WebSocket, message: dict):
    """Handle joining a room"""
    room_code = message.get("room_code")
    player_name = message.get("player_name")
    avatar = message.get("avatar", "💎")
    
    if room_code not in rooms:
        await manager.send_personal_message({
            "type": "error",
            "message": "Room not found"
        }, "unknown")
        return
    
    room = rooms[room_code]
    
    if len(room.players) >= room.max_players:
        await manager.send_personal_message({
            "type": "error",
            "message": "Room is full"
        }, "unknown")
        return
    
    # Create player
    colors = ["#DC2626", "#2563EB", "#059669", "#D97706", "#7C3AED", "#BE185D"]
    player_color = colors[len(room.players) % len(colors)]
    
    player = Player(
        name=player_name,
        avatar=avatar,
        color=player_color
    )
    
    # Add player to room
    room.players.append(player)
    players_data[player.id] = player
    
    # Notify all players in room
    await manager.broadcast_to_room({
        "type": "player-joined",
        "player": player.dict(),
        "room": room.dict()
    }, room_code)

async def handle_player_ready(room_code: str, player_id: str, message: dict):
    """Handle player ready status change"""
    if room_code not in rooms:
        return
    
    ready = message.get("ready", False)
    room = rooms[room_code]
    
    # Update player ready status
    for player in room.players:
        if player.id == player_id:
            player.ready = ready
            break
    
    # Broadcast update
    await manager.broadcast_to_room({
        "type": "room-updated",
        "room": room.dict()
    }, room_code)

async def handle_start_game(room_code: str, player_id: str):
    """Handle game start"""
    if room_code not in rooms:
        return
    
    room = rooms[room_code]
    
    # Check if player is host
    if room.host_id != player_id:
        await manager.send_personal_message({
            "type": "error",
            "message": "Only the host can start the game"
        }, player_id)
        return
    
    # Check if all players are ready
    if len(room.players) < 2 or not all(p.ready for p in room.players):
        await manager.send_personal_message({
            "type": "error",
            "message": "All players must be ready to start"
        }, player_id)
        return
    
    # Create game state
    game_state = game_engine.create_game(room_code, room.players)
    room.game_started = True
    
    # Broadcast game start
    await manager.broadcast_to_room({
        "type": "game-started",
        "game_state": game_state.dict()
    }, room_code)

async def handle_roll_dice(room_code: str, player_id: str):
    """Handle dice roll"""
    try:
        dice1, dice2, total = game_engine.roll_dice(room_code, player_id)
        game = game_engine.get_game(room_code)
        
        # Broadcast dice roll
        await manager.broadcast_to_room({
            "type": "dice-rolled",
            "player_id": player_id,
            "dice1": dice1,
            "dice2": dice2,
            "total": total,
            "game_state": game.dict()
        }, room_code)
        
        # Auto-move player
        new_position = game_engine.move_player(room_code, player_id, total)
        
        # Broadcast player movement
        await manager.broadcast_to_room({
            "type": "player-moved",
            "player_id": player_id,
            "new_position": new_position,
            "game_state": game.dict()
        }, room_code)
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": str(e)
        }, player_id)

async def handle_buy_property(room_code: str, player_id: str, message: dict):
    """Handle property purchase"""
    try:
        property_id = message.get("property_id")
        game_engine.buy_property(room_code, player_id, property_id)
        game = game_engine.get_game(room_code)
        
        # Broadcast property purchase
        await manager.broadcast_to_room({
            "type": "property-bought",
            "player_id": player_id,
            "property_id": property_id,
            "game_state": game.dict()
        }, room_code)
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": str(e)
        }, player_id)

async def handle_end_turn(room_code: str, player_id: str):
    """Handle turn end"""
    try:
        game_engine.end_turn(room_code, player_id)
        game = game_engine.get_game(room_code)
        
        # Broadcast turn end
        await manager.broadcast_to_room({
            "type": "turn-ended",
            "current_player_id": game.players[game.current_player].id,
            "game_state": game.dict()
        }, room_code)
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": str(e)
        }, player_id)

async def handle_chat_message(room_code: str, player_id: str, message: dict):
    """Handle chat message"""
    chat_text = message.get("message", "")
    if not chat_text.strip():
        return
    
    player = players_data.get(player_id)
    if not player:
        return
    
    # Create chat message
    chat_message = ChatMessage(
        room_code=room_code,
        player_id=player_id,
        player_name=player.name,
        message=chat_text
    )
    
    # Broadcast chat message
    await manager.broadcast_to_room({
        "type": "chat-message",
        "player_id": player_id,
        "player_name": player.name,
        "message": chat_text,
        "timestamp": chat_message.timestamp.isoformat()
    }, room_code)

async def handle_leave_room(room_code: str, player_id: str):
    """Handle player leaving room"""
    if room_code in rooms:
        room = rooms[room_code]
        room.players = [p for p in room.players if p.id != player_id]
        
        # If host left, assign new host
        if room.host_id == player_id and room.players:
            room.host_id = room.players[0].id
            room.players[0].is_host = True
        
        # Remove empty rooms
        if not room.players:
            del rooms[room_code]
        else:
            # Broadcast player left
            await manager.broadcast_to_room({
                "type": "player-left",
                "player_id": player_id,
                "room": room.dict()
            }, room_code)
    
    # Clean up player data
    if player_id in players_data:
        del players_data[player_id]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
