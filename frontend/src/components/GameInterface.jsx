import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, 
  Home, Coins, Users, MessageCircle, Settings,
  ShoppingCart, Handshake, CreditCard
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import MonopolyBoard from './MonopolyBoard';
import { mockGameState, indianProperties, chanceCards, communityChestCards } from '../data/mockData';

const GameInterface = ({ onBackToLobby }) => {
  const [gameState, setGameState] = useState(mockGameState);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { player: 'System', message: 'खेल शुरू हो गया है!', timestamp: Date.now() },
    { player: 'राज Kumar', message: 'Good luck everyone! 🎲', timestamp: Date.now() - 30000 },
    { player: 'प्रिया Singh', message: 'Let\'s play fair! 🇮🇳', timestamp: Date.now() - 60000 }
  ]);

  const { toast } = useToast();

  const DiceComponent = ({ value, rolling }) => {
    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1] || Dice1;
    return (
      <div className={`dice ${rolling ? 'rolling' : ''}`}>
        <DiceIcon className="w-12 h-12" />
      </div>
    );
  };

  const rollDice = async () => {
    if (diceRolling) return;
    
    setDiceRolling(true);
    
    // Simulate dice rolling animation
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setGameState(prev => ({
        ...prev,
        diceValues: [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ]
      }));
    }
    
    // Final dice values
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    setGameState(prev => ({
      ...prev,
      diceValues: [dice1, dice2],
      turnPhase: 'move'
    }));
    
    setDiceRolling(false);
    
    toast({
      title: "पासा फेंका गया!",
      description: `आपको ${dice1} + ${dice2} = ${total} मिला`,
    });

    // Simulate player movement
    setTimeout(() => {
      movePlayer(total);
    }, 1000);
  };

  const movePlayer = (spaces) => {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const newPosition = (currentPlayer.position + spaces) % 40;
    
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayer] = {
        ...newPlayers[prev.currentPlayer],
        position: newPosition
      };
      
      return {
        ...prev,
        players: newPlayers,
        turnPhase: 'action'
      };
    });

    // Check what happens at the new position
    const property = indianProperties.find(p => p.id === newPosition);
    handleLandingOnSpace(property);
  };

  const handleLandingOnSpace = (property) => {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    if (property.type === 'property' || property.type === 'railroad' || property.type === 'utility') {
      setSelectedProperty(property);
      setShowPropertyModal(true);
    } else if (property.type === 'chance') {
      const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
      setCurrentCard(card);
      setShowCardModal(true);
    } else if (property.type === 'community') {
      const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
      setCurrentCard(card);
      setShowCardModal(true);
    }
    
    addToGameLog(`${currentPlayer.name} landed on ${property.nameHindi}`);
  };

  const buyProperty = () => {
    if (!selectedProperty) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    if (currentPlayer.money >= selectedProperty.price) {
      setGameState(prev => {
        const newPlayers = [...prev.players];
        newPlayers[prev.currentPlayer] = {
          ...newPlayers[prev.currentPlayer],
          money: newPlayers[prev.currentPlayer].money - selectedProperty.price,
          properties: [...newPlayers[prev.currentPlayer].properties, selectedProperty.id]
        };
        
        return {
          ...prev,
          players: newPlayers
        };
      });
      
      toast({
        title: "संपत्ति खरीदी गई!",
        description: `आपने ${selectedProperty.nameHindi} ₹${selectedProperty.price} में खरीदा`,
      });
      
      addToGameLog(`${currentPlayer.name} bought ${selectedProperty.nameHindi} for ₹${selectedProperty.price}`);
    } else {
      toast({
        title: "अपर्याप्त राशि",
        description: "आपके पास पर्याप्त पैसे नहीं हैं",
        variant: "destructive"
      });
    }
    
    setShowPropertyModal(false);
  };

  const endTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % prev.players.length,
      turnPhase: 'roll'
    }));
    
    addToGameLog(`Turn ended. Next player's turn.`);
  };

  const addToGameLog = (message) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog, message].slice(-10) // Keep last 10 messages
    }));
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const newMessage = {
      player: currentPlayer.name,
      message: chatMessage,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, newMessage].slice(-50)); // Keep last 50 messages
    setChatMessage('');
  };

  const currentPlayer = gameState.players[gameState.currentPlayer];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Game Board */}
          <div className="xl:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-green-800">🇮🇳 भारतीय हेरिटेज मोनोपली</h1>
              <Button variant="outline" onClick={onBackToLobby}>
                <Home className="w-4 h-4 mr-2" />
                मुख्य मेन्यू
              </Button>
            </div>
            
            <MonopolyBoard 
              gameState={gameState} 
              onPropertyClick={(property) => {
                setSelectedProperty(property);
                setShowPropertyModal(true);
              }}
            />
          </div>

          {/* Side Panel */}
          <div className="xl:col-span-1 space-y-4">
            {/* Current Player Turn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  वर्तमान खिलाड़ी
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl mb-2">{currentPlayer.avatar}</div>
                  <div className="font-bold">{currentPlayer.name}</div>
                  <div className="text-green-600 font-semibold">₹{currentPlayer.money.toLocaleString()}</div>
                  <div className="flex justify-center gap-2 mt-4">
                    <DiceComponent value={gameState.diceValues[0]} rolling={diceRolling} />
                    <DiceComponent value={gameState.diceValues[1]} rolling={diceRolling} />
                  </div>
                  {gameState.turnPhase === 'roll' && (
                    <Button 
                      onClick={rollDice}
                      disabled={diceRolling}
                      className="mt-4 bg-orange-600 hover:bg-orange-700"
                    >
                      पासा फेंकें 🎲
                    </Button>
                  )}
                  {gameState.turnPhase === 'action' && (
                    <Button 
                      onClick={endTurn}
                      className="mt-4 bg-green-600 hover:bg-green-700"
                    >
                      पारी समाप्त करें
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Players List */}
            <Card>
              <CardHeader>
                <CardTitle>खिलाड़ी</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gameState.players.map((player, index) => (
                    <div 
                      key={player.id}
                      className={`p-3 rounded-lg border ${
                        index === gameState.currentPlayer 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{player.avatar}</div>
                          <div>
                            <div className="font-semibold text-sm">{player.name}</div>
                            <div className="text-xs text-green-600">₹{player.money.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {player.properties.length} संपत्तियां
                          </div>
                          {player.inJail && (
                            <Badge variant="destructive" className="text-xs">जेल में</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Actions */}
            <Card>
              <CardHeader>
                <CardTitle>गेम एक्शन</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setShowTradeModal(true)}
                >
                  <Handshake className="w-4 h-4 mr-2" />
                  ट्रेड करें
                </Button>
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  संपत्ति प्रबंधन
                </Button>
                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  मॉर्गेज/अनमॉर्गेज
                </Button>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  चैट
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-gray-50 rounded p-2 mb-3 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="text-sm mb-1">
                      <strong>{msg.player}:</strong> {msg.message}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="संदेश टाइप करें..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendChatMessage}>
                    भेजें
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Property Modal */}
      <Dialog open={showPropertyModal} onOpenChange={setShowPropertyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProperty?.nameHindi} - {selectedProperty?.name}</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{selectedProperty.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{selectedProperty.description}</div>
              </div>
              
              {selectedProperty.rent && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-semibold mb-2">किराया:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>बेसिक: ₹{selectedProperty.rent[0]}</div>
                    <div>1 घर: ₹{selectedProperty.rent[1]}</div>
                    <div>2 घर: ₹{selectedProperty.rent[2]}</div>
                    <div>3 घर: ₹{selectedProperty.rent[3]}</div>
                    <div>4 घर: ₹{selectedProperty.rent[4]}</div>
                    <div>होटल: ₹{selectedProperty.rent[5]}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={buyProperty} className="flex-1">
                  खरीदें
                </Button>
                <Button variant="outline" onClick={() => setShowPropertyModal(false)} className="flex-1">
                  बंद करें
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Card Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCard?.title}</DialogTitle>
          </DialogHeader>
          {currentCard && (
            <div className="space-y-4 text-center">
              <div className="text-4xl">🎯</div>
              <div className="text-lg">{currentCard.description}</div>
              <Button onClick={() => setShowCardModal(false)}>
                समझ गया
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .dice {
          transition: transform 0.1s ease;
        }
        .dice.rolling {
          animation: spin 0.1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GameInterface;