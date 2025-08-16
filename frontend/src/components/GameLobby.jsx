import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Copy, Share2, Play, Settings, Crown, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const GameLobby = ({ onStartGame, onJoinGame, gameMode, setGameMode }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [mockPlayers, setMockPlayers] = useState([]);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockRoomData = {
    code: 'HERITAGE2024',
    host: 'Raj Kumar',
    players: [
      { id: 1, name: 'Raj Kumar', avatar: '👑', ready: true, isHost: true },
      { id: 2, name: 'Priya Singh', avatar: '💎', ready: true, isHost: false },
      { id: 3, name: 'Amit Sharma', avatar: '🎭', ready: false, isHost: false }
    ],
    maxPlayers: 6,
    settings: {
      startingMoney: 15000,
      houseLimit: 32,
      hotelLimit: 12
    }
  };

  const avatars = ['👑', '💎', '🎭', '🏆', '⭐', '🌟', '💫', '🔥'];

  const createRoom = () => {
    if (!playerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue",
        variant: "destructive"
      });
      return;
    }

    // Mock room creation with AI players
    const newRoom = {
      ...mockRoomData,
      host: playerName,
      players: [
        { 
          id: 1, 
          name: playerName, 
          avatar: avatars[Math.floor(Math.random() * avatars.length)], 
          ready: true, 
          isHost: true 
        },
        { 
          id: 2, 
          name: 'Priya Singh', 
          avatar: '💎', 
          ready: true, 
          isHost: false 
        }
      ]
    };
    
    setCurrentRoom(newRoom);
    setMockPlayers(newRoom.players);
    
    toast({
      title: "Room Created Successfully!",
      description: `Room Code: ${newRoom.code}`,
    });
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

    // Mock joining
    const joinedRoom = {
      ...mockRoomData,
      players: [
        ...mockRoomData.players,
        { 
          id: Date.now(), 
          name: playerName, 
          avatar: avatars[Math.floor(Math.random() * avatars.length)], 
          ready: false, 
          isHost: false 
        }
      ]
    };
    
    setCurrentRoom(joinedRoom);
    setMockPlayers(joinedRoom.players);
    
    toast({
      title: "Joined Room Successfully!",
      description: `Welcome to room ${roomCode}`,
    });
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
    // Mock ready toggle
    setMockPlayers(prev => prev.map(player => 
      player.name === playerName 
        ? { ...player, ready: !player.ready }
        : player
    ));
  };

  const startGame = () => {
    onStartGame();
  };

  const isHost = currentRoom && mockPlayers.find(p => p.name === playerName)?.isHost;
  const allReady = mockPlayers.length >= 2 && mockPlayers.every(p => p.ready);

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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyRoomCode}
                    className="flex items-center gap-2 border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {mockPlayers.map((player) => (
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
                        {player.isHost && (
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
                  {Array.from({ length: currentRoom.maxPlayers - mockPlayers.length }).map((_, index) => (
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
                  className={`w-full text-lg py-6 font-bold ${
                    mockPlayers.find(p => p.name === playerName)?.ready 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" 
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  } shadow-lg`}
                >
                  {mockPlayers.find(p => p.name === playerName)?.ready ? '✓ Ready' : 'Get Ready'}
                </Button>

                {isHost && (
                  <Button
                    onClick={startGame}
                    disabled={!allReady}
                    className="w-full text-lg py-6 font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg disabled:opacity-50"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                )}

                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 text-slate-200">
                  <div className="flex justify-between">
                    <span className="font-medium">Players:</span>
                    <span className="text-amber-300">{mockPlayers.length}/{currentRoom.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Starting Money:</span>
                    <span className="text-emerald-300">₹{currentRoom.settings.startingMoney.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">House Limit:</span>
                    <span className="text-blue-300">{currentRoom.settings.houseLimit}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentRoom(null)}
                  className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20"
                >
                  Leave Room
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <Card className="mt-8 bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-amber-100 text-xl font-bold">Game Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-slate-700/30 rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="text-sm text-slate-300 space-y-2">
                  <div><strong className="text-amber-300">System:</strong> {playerName} joined the room</div>
                  <div><strong className="text-purple-300">Raj Kumar:</strong> Welcome everyone! Let's have a great game 🎲</div>
                  <div><strong className="text-pink-300">Priya Singh:</strong> Looking forward to this! 🇮🇳</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Send
                </Button>
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
          <p className="text-lg text-slate-300">Experience the luxury of Indian states and cities</p>
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
            <CardTitle className="text-amber-100 text-2xl font-bold text-center">Premium Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-4xl">🎲</div>
                <div className="text-lg font-bold text-white">Animated Dice</div>
                <div className="text-sm text-slate-300">Realistic rolling physics</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">🏰</div>
                <div className="text-lg font-bold text-white">Property Empire</div>
                <div className="text-sm text-slate-300">Build your Indian legacy</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">🤝</div>
                <div className="text-lg font-bold text-white">Smart Trading</div>
                <div className="text-sm text-slate-300">Advanced negotiation system</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl">🎭</div>
                <div className="text-lg font-bold text-white">Cultural Cards</div>
                <div className="text-sm text-slate-300">Authentic Indian themes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameLobby;