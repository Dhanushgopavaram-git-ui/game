import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Copy, Share2, Play, Settings, Crown, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GameLobby = ({ onStartGame, onJoinGame, gameMode, setGameMode }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const avatars = ['👑', '💎', '🎭', '🏆', '⭐', '🌟', '💫', '🔥'];

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const connectWebSocket = (roomCode, playerId) => {
    const wsUrl = `${BACKEND_URL.replace('http', 'ws')}/ws/${roomCode}/${playerId}`;
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to game server",
        variant: "destructive"
      });
    };

    return websocket;
  };

  const handleWebSocketMessage = (message) => {
    console.log('Received message:', message);
    
    switch (message.type) {
      case 'room-created':
        setCurrentRoom(message.room);
        setCurrentPlayer({ id: message.player_id });
        toast({
          title: "Room Created!",
          description: `Room Code: ${message.room_code}`,
        });
        break;
        
      case 'player-joined':
      case 'room-updated':
        setCurrentRoom(message.room);
        break;
        
      case 'game-started':
        onStartGame(message.game_state);
        break;
        
      case 'error':
        toast({
          title: "Error",
          description: message.message,
          variant: "destructive"
        });
        break;
        
      default:
        console.log('Unhandled message type:', message.type);
    }
  };

  const createRoom = () => {
    if (!playerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue",
        variant: "destructive"
      });
      return;
    }

    // Create temporary WebSocket connection
    const tempWs = new WebSocket(`${BACKEND_URL.replace('http', 'ws')}/ws/temp/temp`);
    
    tempWs.onopen = () => {
      tempWs.send(JSON.stringify({
        type: 'create-room',
        player_name: playerName,
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      }));
    };

    tempWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'room-created') {
        tempWs.close();
        const websocket = connectWebSocket(message.room_code, message.player_id);
        setCurrentRoom(message.room);
        setCurrentPlayer({ id: message.player_id });
      }
    };
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      toast({
        title: "Details Required",
        description: "Please enter your name and room code",
        variant: "destructive"
      });
      return;
    }

    // Create temporary WebSocket connection
    const tempWs = new WebSocket(`${BACKEND_URL.replace('http', 'ws')}/ws/temp/temp`);
    
    tempWs.onopen = () => {
      tempWs.send(JSON.stringify({
        type: 'join-room',
        room_code: roomCode,
        player_name: playerName,
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      }));
    };

    tempWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'player-joined') {
        tempWs.close();
        const playerId = message.player.id;
        const websocket = connectWebSocket(roomCode, playerId);
        setCurrentRoom(message.room);
        setCurrentPlayer({ id: playerId });
      }
    };
  };

  const copyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.code);
      toast({
        title: "Code Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  const toggleReady = () => {
    if (ws && currentPlayer) {
      ws.send(JSON.stringify({
        type: 'player-ready',
        ready: !getCurrentPlayerReadyStatus()
      }));
    }
  };

  const startGame = () => {
    if (ws && currentPlayer) {
      ws.send(JSON.stringify({
        type: 'start-game'
      }));
    }
  };

  const getCurrentPlayerReadyStatus = () => {
    if (!currentRoom || !currentPlayer) return false;
    const player = currentRoom.players.find(p => p.id === currentPlayer.id);
    return player ? player.ready : false;
  };

  const isHost = currentRoom && currentPlayer && currentRoom.host_id === currentPlayer.id;
  const allReady = currentRoom && currentRoom.players.length >= 2 && currentRoom.players.every(p => p.ready);

  if (currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="w-10 h-10 text-amber-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Indian Heritage Monopoly
              </h1>
              <Crown className="w-10 h-10 text-amber-400" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <p className="text-xl text-purple-200 font-light">Premium Edition</p>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room Info */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-amber-100">
                  <span className="text-2xl font-bold">Room: {currentRoom.code}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyRoomCode}
                      className="flex items-center gap-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {currentRoom.players.map((player) => (
                    <div
                      key={player.id}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        player.ready 
                          ? 'border-emerald-400 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 shadow-emerald-500/20 shadow-lg' 
                          : 'border-amber-400 bg-gradient-to-br from-amber-500/20 to-amber-600/20 shadow-amber-500/20 shadow-lg'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{player.avatar}</div>
                        <div className="font-bold text-white text-lg mb-2">{player.name}</div>
                        {player.is_host && (
                          <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                            Host
                          </Badge>
                        )}
                        <Badge 
                          className={`${
                            player.ready 
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                              : "bg-gradient-to-r from-slate-500 to-slate-600"
                          } text-white border-0`}
                        >
                          {player.ready ? 'Ready' : 'Waiting'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array.from({ length: currentRoom.max_players - currentRoom.players.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="p-6 rounded-xl border-2 border-dashed border-slate-500 bg-gradient-to-br from-slate-700/30 to-slate-800/30"
                    >
                      <div className="text-center text-slate-400">
                        <Users className="w-10 h-10 mx-auto mb-3" />
                        <div className="text-sm font-medium">Empty Slot</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-amber-100 text-xl font-bold">Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={toggleReady}
                  disabled={!connected}
                  className={`w-full text-lg py-6 font-bold ${
                    getCurrentPlayerReadyStatus() 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" 
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  } shadow-lg disabled:opacity-50`}
                >
                  {getCurrentPlayerReadyStatus() ? '✓ Ready' : 'Get Ready'}
                </Button>

                {isHost && (
                  <Button
                    onClick={startGame}
                    disabled={!allReady || !connected}
                    className="w-full text-lg py-6 font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg disabled:opacity-50"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                )}

                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 text-slate-200">
                  <div className="flex justify-between">
                    <span className="font-medium">Players:</span>
                    <span className="text-amber-300">{currentRoom.players.length}/{currentRoom.max_players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Starting Money:</span>
                    <span className="text-emerald-300">₹{currentRoom.settings.starting_money.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={connected ? "text-emerald-300" : "text-red-300"}>
                      {connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (ws) ws.close();
                    setCurrentRoom(null);
                    setCurrentPlayer(null);
                  }}
                  className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20"
                >
                  Leave Room
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Status */}
          <Card className="mt-8 bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-amber-100 text-xl font-bold">Live Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-300">
                <div>• Real-time multiplayer connection: {connected ? '🟢 Active' : '🔴 Inactive'}</div>
                <div>• Players ready: {currentRoom.players.filter(p => p.ready).length}/{currentRoom.players.length}</div>
                <div>• WebSocket status: {connected ? 'Connected' : 'Disconnected'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="w-12 h-12 text-amber-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Indian Heritage Monopoly
            </h1>
            <Crown className="w-12 h-12 text-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <p className="text-2xl text-purple-200 font-light">Premium Edition</p>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-lg text-slate-300">Experience real-time multiplayer with Indian states and cities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Room */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-100 text-xl">
                <Settings className="w-6 h-6 text-amber-400" />
                Create New Room
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 text-lg py-6"
              />
              <Button 
                onClick={createRoom} 
                className="w-full text-lg py-6 font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
              >
                Create Room
              </Button>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-100 text-xl">
                <Share2 className="w-6 h-6 text-amber-400" />
                Join Existing Room
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 text-lg py-6"
              />
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 text-lg py-6"
              />
              <Button 
                onClick={joinRoom} 
                className="w-full text-lg py-6 font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
              >
                Join Room
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-amber-100 text-2xl font-bold text-center">Premium Real-Time Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-4xl">🎲</div>
                <div className="text-lg font-bold text-white">Live Dice Rolling</div>
                <div className="text-sm text-slate-300">Real-time synchronized gameplay</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">🏰</div>
                <div className="text-lg font-bold text-white">Property Empire</div>
                <div className="text-sm text-slate-300">Build your Indian legacy</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">🤝</div>
                <div className="text-lg font-bold text-white">Live Trading</div>
                <div className="text-sm text-slate-300">Real-time negotiations</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">🌐</div>
                <div className="text-lg font-bold text-white">Multiplayer</div>
                <div className="text-sm text-slate-300">Up to 6 players online</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameLobby;