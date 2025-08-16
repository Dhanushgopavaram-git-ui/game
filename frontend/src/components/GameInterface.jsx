import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, 
  Home, Coins, Users, MessageCircle, Settings,
  ShoppingCart, Handshake, CreditCard, Crown, Sparkles, 
  Building, TrendingUp, Trophy
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
    { player: 'System', message: 'Premium game session started!', timestamp: Date.now() },
    { player: 'Raj Kumar', message: 'Ready for an epic game! 🎲', timestamp: Date.now() - 30000 },
    { player: 'Priya Singh', message: 'May the best player win! 🏆', timestamp: Date.now() - 60000 }
  ]);

  const { toast } = useToast();

  const DiceComponent = ({ value, rolling }) => {
    const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value - 1] || Dice1;
    return (
      <div className={`dice ${rolling ? 'rolling' : ''}`}>
        <DiceIcon className="w-16 h-16 text-amber-400" />
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
      title: "Dice Rolled!",
      description: `You rolled ${dice1} + ${dice2} = ${total}`,
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
    
    addToGameLog(`${currentPlayer.name} landed on ${property.name}`);
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
        title: "Property Purchased!",
        description: `You bought ${selectedProperty.name} for ₹${selectedProperty.price.toLocaleString()}`,
      });
      
      addToGameLog(`${currentPlayer.name} bought ${selectedProperty.name} for ₹${selectedProperty.price.toLocaleString()}`);
    } else {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough money for this purchase",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Game Board */}
          <div className="xl:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                  Indian Heritage Monopoly
                </h1>
              </div>
              <Button 
                variant="outline" 
                onClick={onBackToLobby}
                className="border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
              >
                <Home className="w-4 h-4 mr-2" />
                Main Menu
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
          <div className="xl:col-span-1 space-y-6">
            {/* Current Player Turn */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-100">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  Current Player
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl mb-4">{currentPlayer.avatar}</div>
                  <div className="font-bold text-white text-xl mb-2">{currentPlayer.name}</div>
                  <div className="text-emerald-400 font-bold text-lg mb-6">₹{currentPlayer.money.toLocaleString()}</div>
                  
                  <div className="flex justify-center gap-4 mb-6">
                    <DiceComponent value={gameState.diceValues[0]} rolling={diceRolling} />
                    <DiceComponent value={gameState.diceValues[1]} rolling={diceRolling} />
                  </div>
                  
                  {gameState.turnPhase === 'roll' && (
                    <Button 
                      onClick={rollDice}
                      disabled={diceRolling}
                      className="w-full text-lg py-6 font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Roll Dice 🎲
                    </Button>
                  )}
                  {gameState.turnPhase === 'action' && (
                    <Button 
                      onClick={endTurn}
                      className="w-full text-lg py-6 font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                    >
                      End Turn
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Players List */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameState.players.map((player, index) => (
                    <div 
                      key={player.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        index === gameState.currentPlayer 
                          ? 'border-amber-400 bg-gradient-to-r from-amber-500/20 to-amber-600/20 shadow-amber-500/20 shadow-lg' 
                          : 'border-slate-600 bg-gradient-to-r from-slate-700/30 to-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{player.avatar}</div>
                          <div>
                            <div className="font-bold text-white">{player.name}</div>
                            <div className="text-emerald-400 font-semibold">₹{player.money.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-300 mb-1">
                            <Building className="w-4 h-4 inline mr-1" />
                            {player.properties.length} properties
                          </div>
                          {player.inJail && (
                            <Badge variant="destructive" className="text-xs">In Jail</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Actions */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-amber-100">Premium Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20" 
                  onClick={() => setShowTradeModal(true)}
                >
                  <Handshake className="w-4 h-4 mr-2" />
                  Trade Properties
                </Button>
                <Button variant="outline" className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
                  <Building className="w-4 h-4 mr-2" />
                  Manage Properties
                </Button>
                <Button variant="outline" className="w-full border-green-500/50 text-green-300 hover:bg-green-500/20">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Mortgage/Unmortgage
                </Button>
                <Button variant="outline" className="w-full border-amber-500/50 text-amber-300 hover:bg-amber-500/20">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Build Houses/Hotels
                </Button>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-amber-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-100">
                  <MessageCircle className="w-5 h-5" />
                  Game Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-slate-700/30 rounded-lg p-3 mb-4 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="text-sm mb-2 text-slate-300">
                      <strong className="text-amber-300">{msg.player}:</strong> {msg.message}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  />
                  <Button 
                    size="sm" 
                    onClick={sendChatMessage}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Property Modal */}
      <Dialog open={showPropertyModal} onOpenChange={setShowPropertyModal}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-900 border-amber-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-300">
              {selectedProperty?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">
                  ₹{selectedProperty.price?.toLocaleString()}
                </div>
                <div className="text-slate-300 italic">{selectedProperty.description}</div>
              </div>
              
              {selectedProperty.rent && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-lg font-bold mb-3 text-amber-300">Rent Structure:</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Base:</span>
                      <span className="text-emerald-300">₹{selectedProperty.rent[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 House:</span>
                      <span className="text-emerald-300">₹{selectedProperty.rent[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 Houses:</span>
                      <span className="text-emerald-300">₹{selectedProperty.rent[2]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3 Houses:</span>
                      <span className="text-emerald-300">₹{selectedProperty.rent[3]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4 Houses:</span>
                      <span className="text-emerald-300">₹{selectedProperty.rent[4]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hotel:</span>
                      <span className="text-emerald-300">₹{selectedProperty.rent[5]}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={buyProperty} 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                >
                  Purchase Property
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPropertyModal(false)} 
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Card Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-purple-900 border-amber-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-300">
              {currentCard?.title}
            </DialogTitle>
          </DialogHeader>
          {currentCard && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">🎯</div>
              <div className="text-lg text-slate-300">{currentCard.description}</div>
              <Button 
                onClick={() => setShowCardModal(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Understood
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .dice {
          transition: transform 0.2s ease;
          padding: 8px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e293b, #475569);
          border: 2px solid #fbbf24;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }
        .dice.rolling {
          animation: spin 0.2s linear infinite;
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