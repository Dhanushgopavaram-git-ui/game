import asyncio
import json
from typing import Dict, List, Set
from fastapi import WebSocket
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Store active connections by room
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Store player to websocket mapping
        self.player_connections: Dict[str, WebSocket] = {}
        # Store websocket to player mapping
        self.connection_players: Dict[WebSocket, str] = {}
        # Store websocket to room mapping
        self.connection_rooms: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, room_code: str, player_id: str):
        """Connect a player to a room"""
        await websocket.accept()
        
        # Initialize room if it doesn't exist
        if room_code not in self.active_connections:
            self.active_connections[room_code] = []
        
        # Add connection to room
        self.active_connections[room_code].append(websocket)
        
        # Store player mappings
        self.player_connections[player_id] = websocket
        self.connection_players[websocket] = player_id
        self.connection_rooms[websocket] = room_code
        
        logger.info(f"Player {player_id} connected to room {room_code}")

    async def disconnect(self, websocket: WebSocket):
        """Disconnect a player"""
        try:
            player_id = self.connection_players.get(websocket)
            room_code = self.connection_rooms.get(websocket)
            
            if room_code and websocket in self.active_connections.get(room_code, []):
                self.active_connections[room_code].remove(websocket)
                
                # Clean up empty rooms
                if not self.active_connections[room_code]:
                    del self.active_connections[room_code]
            
            # Clean up mappings
            if player_id:
                self.player_connections.pop(player_id, None)
            self.connection_players.pop(websocket, None)
            self.connection_rooms.pop(websocket, None)
            
            logger.info(f"Player {player_id} disconnected from room {room_code}")
            
        except Exception as e:
            logger.error(f"Error during disconnect: {e}")

    async def send_personal_message(self, message: dict, player_id: str):
        """Send message to a specific player"""
        websocket = self.player_connections.get(player_id)
        if websocket:
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending personal message to {player_id}: {e}")
                await self.disconnect(websocket)

    async def broadcast_to_room(self, message: dict, room_code: str, exclude_player: str = None):
        """Broadcast message to all players in a room"""
        if room_code not in self.active_connections:
            return
            
        connections = self.active_connections[room_code].copy()
        disconnected = []
        
        for connection in connections:
            try:
                player_id = self.connection_players.get(connection)
                if exclude_player and player_id == exclude_player:
                    continue
                    
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to room {room_code}: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            await self.disconnect(connection)

    async def broadcast_to_all(self, message: dict):
        """Broadcast message to all connected players"""
        for room_code in self.active_connections:
            await self.broadcast_to_room(message, room_code)

    def get_room_players(self, room_code: str) -> List[str]:
        """Get list of player IDs in a room"""
        if room_code not in self.active_connections:
            return []
        
        player_ids = []
        for connection in self.active_connections[room_code]:
            player_id = self.connection_players.get(connection)
            if player_id:
                player_ids.append(player_id)
        
        return player_ids

    def is_player_connected(self, player_id: str) -> bool:
        """Check if a player is connected"""
        return player_id in self.player_connections

    def get_room_connection_count(self, room_code: str) -> int:
        """Get number of active connections in a room"""
        return len(self.active_connections.get(room_code, []))

# Global connection manager instance
manager = ConnectionManager()