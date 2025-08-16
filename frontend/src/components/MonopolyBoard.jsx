import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { indianProperties, colorGroups } from '../data/mockData';

const MonopolyBoard = ({ gameState, onPropertyClick }) => {
  const [animatingPiece, setAnimatingPiece] = useState(null);

  const getPropertyColor = (property) => {
    if (property.color && colorGroups[property.color]) {
      return colorGroups[property.color];
    }
    return '#6B7280';
  };

  const getPositionClass = (index) => {
    if (index === 0) return 'corner bottom-right-corner';
    if (index === 10) return 'corner bottom-left-corner';
    if (index === 20) return 'corner top-left-corner';
    if (index === 30) return 'corner top-right-corner';
    
    if (index >= 1 && index <= 9) return 'bottom-side';
    if (index >= 11 && index <= 19) return 'left-side';
    if (index >= 21 && index <= 29) return 'top-side';
    if (index >= 31 && index <= 39) return 'right-side';
    
    return '';
  };

  const getPlayersOnSpace = (spaceId) => {
    return gameState.players.filter(player => player.position === spaceId);
  };

  const PropertySpace = ({ property, index }) => {
    const players = getPlayersOnSpace(property.id);
    const isCorner = [0, 10, 20, 30].includes(property.id);
    const owner = gameState.players.find(p => p.properties.includes(property.id));

    return (
      <div
        className={`property-space ${getPositionClass(index)} ${isCorner ? 'corner-space' : ''}`}
        onClick={() => onPropertyClick(property)}
      >
        {/* Property color bar */}
        {property.color && !isCorner && (
          <div 
            className="color-bar"
            style={{ backgroundColor: getPropertyColor(property) }}
          />
        )}

        {/* Property content */}
        <div className="property-content">
          {isCorner ? (
            <div className="corner-content">
              <div className="corner-icon">
                {property.id === 0 && <span className="text-2xl">▶️</span>}
                {property.id === 10 && <span className="text-2xl">🏛️</span>}
                {property.id === 20 && <span className="text-2xl">🅿️</span>}
                {property.id === 30 && <span className="text-2xl">👮‍♂️</span>}
              </div>
              <div className="corner-name">{property.name}</div>
            </div>
          ) : (
            <>
              <div className="property-name">{property.name}</div>
              {property.price && (
                <div className="property-price">₹{property.price}</div>
              )}
              {property.type === 'railroad' && <div className="property-icon">🚂</div>}
              {property.type === 'utility' && <div className="property-icon">⚡</div>}
              {property.type === 'chance' && <div className="property-icon">🎯</div>}
              {property.type === 'community' && <div className="property-icon">📦</div>}
              {property.type === 'tax' && <div className="property-icon">💰</div>}
            </>
          )}

          {/* Owner indicator */}
          {owner && (
            <div 
              className="owner-indicator"
              style={{ backgroundColor: owner.color }}
            />
          )}

          {/* Player pieces */}
          {players.length > 0 && (
            <div className="player-pieces">
              {players.map((player, idx) => (
                <div
                  key={player.id}
                  className="player-piece"
                  style={{ 
                    backgroundColor: player.color,
                    transform: `translate(${idx * 4}px, ${idx * 4}px)`,
                    boxShadow: `0 0 10px ${player.color}40`
                  }}
                >
                  {player.avatar}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="monopoly-board-container">
      <div className="monopoly-board">
        {/* Center area */}
        <div className="board-center">
          <div className="center-logo">
            <div className="center-crown">👑</div>
            <h2 className="center-title">INDIAN HERITAGE</h2>
            <h1 className="monopoly-title">MONOPOLY</h1>
            <div className="center-decoration">🇮🇳</div>
            <div className="center-subtitle">Premium Edition</div>
          </div>
        </div>

        {/* Board spaces */}
        {indianProperties.map((property, index) => (
          <PropertySpace key={property.id} property={property} index={index} />
        ))}
      </div>

      <style jsx>{`
        .monopoly-board-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .monopoly-board {
          position: relative;
          width: 800px;
          height: 800px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          border: 8px solid;
          border-image: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24) 1;
          border-radius: 20px;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.5),
            inset 0 0 50px rgba(251, 191, 36, 0.1);
          display: grid;
          grid-template-columns: 1fr repeat(9, 80px) 1fr;
          grid-template-rows: 1fr repeat(9, 80px) 1fr;
        }

        .board-center {
          grid-column: 2 / 11;
          grid-row: 2 / 11;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e293b 0%, #475569 50%, #1e293b 100%);
          border: 4px solid;
          border-image: linear-gradient(45deg, #fbbf24, #f59e0b) 1;
          border-radius: 15px;
          margin: 10px;
          box-shadow: inset 0 0 30px rgba(251, 191, 36, 0.2);
        }

        .center-logo {
          text-align: center;
          color: #fbbf24;
        }

        .center-crown {
          font-size: 40px;
          margin-bottom: 10px;
          filter: drop-shadow(0 0 10px #fbbf24);
        }

        .center-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0;
          color: #fbbf24;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .monopoly-title {
          font-size: 42px;
          font-weight: bold;
          margin: 8px 0;
          color: #fff;
          text-shadow: 
            0 0 20px rgba(251, 191, 36, 0.8),
            2px 2px 4px rgba(0,0,0,0.8);
        }

        .center-decoration {
          font-size: 28px;
          margin: 8px 0;
          filter: drop-shadow(0 0 5px #fbbf24);
        }

        .center-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin-top: 8px;
          font-style: italic;
        }

        .property-space {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid #475569;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        .property-space:hover {
          transform: scale(1.08);
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.4),
            0 0 20px rgba(251, 191, 36, 0.3);
          z-index: 10;
          border-color: #fbbf24;
        }

        .corner-space {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #fbbf24;
        }

        .corner {
          grid-column: span 1;
          grid-row: span 1;
        }

        .bottom-right-corner {
          grid-column: 11;
          grid-row: 11;
          border-radius: 0 0 15px 0;
        }

        .bottom-left-corner {
          grid-column: 1;
          grid-row: 11;
          border-radius: 0 0 0 15px;
        }

        .top-left-corner {
          grid-column: 1;
          grid-row: 1;
          border-radius: 15px 0 0 0;
        }

        .top-right-corner {
          grid-column: 11;
          grid-row: 1;
          border-radius: 0 15px 0 0;
        }

        .bottom-side {
          grid-row: 11;
          writing-mode: horizontal-tb;
        }

        .left-side {
          grid-column: 1;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .top-side {
          grid-row: 1;
          writing-mode: horizontal-tb;
          transform: rotate(180deg);
        }

        .right-side {
          grid-column: 11;
          writing-mode: vertical-lr;
          text-orientation: mixed;
        }

        .color-bar {
          height: 22px;
          width: 100%;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }

        .property-content {
          flex: 1;
          padding: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
        }

        .corner-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .corner-icon {
          margin-bottom: 8px;
        }

        .corner-name {
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          line-height: 1.2;
          text-shadow: 0 0 5px rgba(251, 191, 36, 0.3);
        }

        .property-name {
          font-size: 9px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 3px;
          line-height: 1.1;
          color: #1e293b;
        }

        .property-price {
          font-size: 8px;
          color: #059669;
          text-align: center;
          font-weight: 600;
        }

        .property-icon {
          font-size: 14px;
          margin-top: 2px;
        }

        .owner-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .player-pieces {
          position: absolute;
          bottom: 3px;
          right: 3px;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
        }

        .player-piece {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid #fff;
          transition: transform 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .player-piece:hover {
          transform: scale(1.3);
        }

        @keyframes moveAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .animating {
          animation: moveAnimation 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MonopolyBoard;