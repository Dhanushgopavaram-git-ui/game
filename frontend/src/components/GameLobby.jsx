import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Copy, Share2, Play, Settings } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const GameLobby = ({ onStartGame, onJoinGame, gameMode, setGameMode }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [mockPlayers, setMockPlayers] = useState([]);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockRoomData = {
    code: 'DELHI2024',
    host: 'राज Kumar',
    players: [
      { id: 1, name: 'राज Kumar', avatar: '🤴', ready: true, isHost: true },
      { id: 2, name: 'प्रिया Singh', avatar: '👸', ready: true, isHost: false },
      { id: 3, name: 'अमित Sharma', avatar: '🧔', ready: false, isHost: false }
    ],
    maxPlayers: 6,
    settings: {
      startingMoney: 15000,
      houseLimit: 32,
      hotelLimit: 12
    }
  };

  const avatars = ['🤴', '👸', '🧔', '👨‍🎓', '👩‍💼', '🧑‍🚀', '👨‍🎨', '👩‍🔬'];

  const createRoom = () => {
    if (!playerName.trim()) {
      toast({
        title: "नाम आवश्यक है",
        description: "कृपया अपना नाम दर्ज करें",
        variant: "destructive"
      });
      return;
    }

    // Mock room creation
    const newRoom = {
      ...mockRoomData,
      host: playerName,
      players: [{ 
        id: 1, 
        name: playerName, 
        avatar: avatars[Math.floor(Math.random() * avatars.length)], 
        ready: true, 
        isHost: true 
      }]
    };
    
    setCurrentRoom(newRoom);
    setMockPlayers(newRoom.players);
    
    toast({
      title: "रूम बनाया गया!",
      description: `Room Code: ${newRoom.code}`,
    });
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      toast({
        title: "विवरण आवश्यक है",
        description: "कृपया नाम और रूम कोड दर्ज करें",
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
      title: "रूम में शामिल हुए!",
      description: `${roomCode} रूम में सफलतापूर्वक शामिल हुए`,
    });
  };

  const copyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.code);
      toast({
        title: "कॉपी किया गया!",
        description: "रूम कोड क्लिपबोर्ड में कॉपी हो गया",
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-800 mb-2">🇮🇳 भारतीय हेरिटेज मोनोपली</h1>
            <p className="text-green-700">खेल लॉबी</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>रूम: {currentRoom.code}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyRoomCode}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    कॉपी करें
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        player.ready 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-orange-500 bg-orange-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{player.avatar}</div>
                        <div className="font-semibold text-sm">{player.name}</div>
                        {player.isHost && (
                          <Badge variant="secondary" className="mt-1">होस्ट</Badge>
                        )}
                        <Badge 
                          variant={player.ready ? "default" : "outline"}
                          className="mt-1"
                        >
                          {player.ready ? 'तैयार' : 'प्रतीक्षा में'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {Array.from({ length: currentRoom.maxPlayers - mockPlayers.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                    >
                      <div className="text-center text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-xs">खाली स्लॉट</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>नियंत्रण</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={toggleReady}
                  variant={mockPlayers.find(p => p.name === playerName)?.ready ? "default" : "outline"}
                  className="w-full"
                >
                  {mockPlayers.find(p => p.name === playerName)?.ready ? 'तैयार ✓' : 'तैयार होें'}
                </Button>

                {isHost && (
                  <Button
                    onClick={startGame}
                    disabled={!allReady}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    खेल शुरू करें
                  </Button>
                )}

                <div className="text-sm text-gray-600 space-y-2">
                  <div><strong>खिलाड़ी:</strong> {mockPlayers.length}/{currentRoom.maxPlayers}</div>
                  <div><strong>प्रारंभिक राशि:</strong> ₹{currentRoom.settings.startingMoney.toLocaleString()}</div>
                  <div><strong>घर सीमा:</strong> {currentRoom.settings.houseLimit}</div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentRoom(null)}
                  className="w-full"
                >
                  रूम छोड़ें
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>चैट</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-50 rounded p-3 mb-3 overflow-y-auto">
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>System:</strong> {playerName} रूम में शामिल हुए</div>
                  <div><strong>राज Kumar:</strong> नमस्ते सभी! खेल का आनंद लें 🎲</div>
                  <div><strong>प्रिया Singh:</strong> बहुत बढ़िया! मैं तैयार हूँ 🇮🇳</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="संदेश टाइप करें..." className="flex-1" />
                <Button size="sm">भेजें</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-800 mb-4">🇮🇳 भारतीय हेरिटेज मोनोपली</h1>
          <p className="text-xl text-green-700 mb-2">भारत के राज्यों और शहरों के साथ खेलें</p>
          <p className="text-gray-600">ऑनलाइन मल्टीप्लेयर गेम</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Room */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                नया रूम बनाएं
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="आपका नाम"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Button onClick={createRoom} className="w-full bg-orange-600 hover:bg-orange-700">
                रूम बनाएं
              </Button>
            </CardContent>
          </Card>

          {/* Join Room */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                रूम में शामिल हों
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="आपका नाम"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Input
                placeholder="रूम कोड"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              />
              <Button onClick={joinRoom} className="w-full bg-green-600 hover:bg-green-700">
                शामिल हों
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>खेल की विशेषताएं</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">🎲</div>
                <div className="text-sm font-semibold">एनिमेटेड डाइस</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🏠</div>
                <div className="text-sm font-semibold">संपत्ति प्रबंधन</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-sm font-semibold">ट्रेडिंग सिस्टम</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🎭</div>
                <div className="text-sm font-semibold">भारतीय कार्ड</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameLobby;