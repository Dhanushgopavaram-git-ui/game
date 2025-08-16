# Indian Heritage Monopoly - Backend Integration Contracts

## API Contracts

### WebSocket Events

#### Client to Server Events
```javascript
// Room Management
'create-room' => { playerName: string, avatar: string }
'join-room' => { roomCode: string, playerName: string, avatar: string }
'leave-room' => { roomCode: string, playerId: string }
'player-ready' => { roomCode: string, playerId: string, ready: boolean }
'start-game' => { roomCode: string }

// Game Actions
'roll-dice' => { roomCode: string, playerId: string }
'buy-property' => { roomCode: string, playerId: string, propertyId: number }
'end-turn' => { roomCode: string, playerId: string }
'send-chat' => { roomCode: string, playerId: string, message: string }
'trade-offer' => { roomCode: string, fromPlayerId: string, toPlayerId: string, offer: object }
'trade-response' => { roomCode: string, playerId: string, tradeId: string, accept: boolean }

// Property Management
'mortgage-property' => { roomCode: string, playerId: string, propertyId: number }
'unmortgage-property' => { roomCode: string, playerId: string, propertyId: number }
'build-house' => { roomCode: string, playerId: string, propertyId: number }
'build-hotel' => { roomCode: string, playerId: string, propertyId: number }
```

#### Server to Client Events
```javascript
// Room Updates
'room-created' => { roomCode: string, room: RoomState }
'room-joined' => { room: RoomState }
'room-updated' => { room: RoomState }
'player-joined' => { player: Player }
'player-left' => { playerId: string }
'game-started' => { gameState: GameState }

// Game Updates
'game-state-updated' => { gameState: GameState }
'dice-rolled' => { playerId: string, dice1: number, dice2: number, total: number }
'player-moved' => { playerId: string, fromPosition: number, toPosition: number }
'property-bought' => { playerId: string, propertyId: number, price: number }
'turn-ended' => { currentPlayerId: string }
'chat-message' => { playerId: string, playerName: string, message: string, timestamp: number }

// Card Events
'chance-card' => { playerId: string, card: ChanceCard }
'community-chest-card' => { playerId: string, card: CommunityChestCard }

// Trade Events
'trade-offered' => { trade: TradeOffer }
'trade-accepted' => { trade: TradeOffer }
'trade-rejected' => { trade: TradeOffer }

// Error Events
'error' => { message: string, code: string }
```

### REST API Endpoints

```javascript
GET /api/rooms => { rooms: Room[] }
GET /api/rooms/:roomCode => { room: Room }
GET /api/game/:roomCode/state => { gameState: GameState }
GET /api/properties => { properties: Property[] }
```

## Data Models

### Room State
```javascript
{
  code: string,
  host: string,
  players: Player[],
  maxPlayers: number,
  gameStarted: boolean,
  settings: {
    startingMoney: number,
    houseLimit: number,
    hotelLimit: number
  },
  createdAt: Date
}
```

### Game State
```javascript
{
  roomCode: string,
  currentPlayer: number,
  players: Player[],
  diceValues: [number, number],
  turnPhase: 'roll' | 'move' | 'action' | 'trade' | 'endTurn',
  properties: Property[],
  chanceCards: Card[],
  communityChestCards: Card[],
  gameLog: string[],
  winner: string | null,
  gameStarted: boolean,
  gameEnded: boolean
}
```

### Player
```javascript
{
  id: string,
  name: string,
  avatar: string,
  money: number,
  position: number,
  properties: number[],
  inJail: boolean,
  jailTurns: number,
  color: string,
  isHost: boolean,
  ready: boolean,
  connected: boolean,
  getOutOfJailCards: number
}
```

### Property
```javascript
{
  id: number,
  name: string,
  type: 'property' | 'railroad' | 'utility' | 'corner' | 'chance' | 'community' | 'tax',
  color?: string,
  price?: number,
  rent?: number[],
  group?: string,
  description: string,
  owner?: string,
  mortgaged: boolean,
  houses: number,
  hotel: boolean
}
```

## Mock Data Replacement Plan

### Frontend Changes Required

1. **Remove mock data imports** in components
2. **Replace mockGameState** with real-time WebSocket data
3. **Update game actions** to emit WebSocket events instead of local state updates
4. **Add loading states** for network operations
5. **Add error handling** for WebSocket disconnections
6. **Add reconnection logic** for dropped connections

### Backend Implementation Plan

1. **MongoDB Collections:**
   - `rooms` - Store room information
   - `games` - Store game states
   - `players` - Store player information
   - `properties` - Store property definitions

2. **WebSocket Server:**
   - Handle real-time communication
   - Manage room state
   - Implement game logic
   - Handle player actions

3. **Game Logic Engine:**
   - Turn management
   - Property transactions
   - Dice rolling
   - Card system
   - Win conditions

4. **Real-time Features:**
   - Live player updates
   - Real-time chat
   - Live game state synchronization
   - Player connection status

## Integration Steps

### Phase 1: Backend Setup
- Create WebSocket server
- Implement room management
- Create MongoDB models
- Basic game state management

### Phase 2: Frontend Integration
- Replace mock data with WebSocket events
- Add loading states and error handling
- Implement real-time updates
- Test basic functionality

### Phase 3: Game Logic
- Implement complete Monopoly rules
- Add property trading system
- Implement card effects
- Add win/lose conditions

### Phase 4: Polish & Testing
- Add reconnection handling
- Implement game persistence
- Add advanced features
- Full testing with multiple players