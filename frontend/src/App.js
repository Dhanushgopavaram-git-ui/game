import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameLobby from './components/GameLobby';
import GameInterface from './components/GameInterface';
import { Toaster } from "./components/ui/sonner";

function App() {
  const [gameMode, setGameMode] = useState('lobby'); // 'lobby', 'game'

  const startGame = () => {
    setGameMode('game');
  };

  const backToLobby = () => {
    setGameMode('lobby');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            gameMode === 'lobby' ? (
              <GameLobby 
                onStartGame={startGame}
                gameMode={gameMode}
                setGameMode={setGameMode}
              />
            ) : (
              <GameInterface 
                onBackToLobby={backToLobby}
              />
            )
          } />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;