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
    return '#9CA3AF';
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
                {property.id === 0 && '→'}
                {property.id === 10 && '🏛️'}
                {property.id === 20 && '🚗'}
                {property.id === 30 && '👮'}
              </div>
              <div className="corner-name">{property.nameHindi}</div>
            </div>
          ) : (
            <>
              <div className="property-name">{property.nameHindi}</div>
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
                    transform: `translate(${idx * 3}px, ${idx * 3}px)`
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
            <h2 className="center-title">भारतीय हेरिटेज</h2>
            <h1 className="monopoly-title">MONOPOLY</h1>
            <div className="center-decoration">🇮🇳</div>
            <div className="center-subtitle">राज्यों और शहरों का खेल</div>
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
          background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%);
          border: 8px solid #d4af37;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
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
          background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%);
          border: 3px solid #d4af37;
          border-radius: 15px;
          margin: 10px;
        }

        .center-logo {
          text-align: center;
          color: #d4af37;
        }

        .center-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: #ffd700;
        }

        .monopoly-title {
          font-size: 48px;
          font-weight: bold;
          margin: 10px 0;
          color: #fff;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .center-decoration {
          font-size: 32px;
          margin: 10px 0;
        }

        .center-subtitle {
          font-size: 16px;
          color: #d4af37;
          margin-top: 10px;
        }

        .property-space {
          background: #fff;
          border: 2px solid #333;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .property-space:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 10;
        }

        .corner-space {
          width: 120px;
          height: 120px;
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
          height: 20px;
          width: 100%;
        }

        .property-content {
          flex: 1;
          padding: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
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
          font-size: 24px;
          margin-bottom: 8px;
        }

        .corner-name {
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          line-height: 1.2;
        }

        .property-name {
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 4px;
          line-height: 1.1;
        }

        .property-price {
          font-size: 8px;
          color: #666;
          text-align: center;
        }

        .property-icon {
          font-size: 16px;
          margin-top: 4px;
        }

        .owner-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .player-pieces {
          position: absolute;
          bottom: 2px;
          right: 2px;
          display: flex;
          flex-wrap: wrap;
          gap: 1px;
        }

        .player-piece {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid #fff;
          transition: transform 0.3s ease;
        }

        .player-piece:hover {
          transform: scale(1.2);
        }

        @keyframes moveAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .animating {
          animation: moveAnimation 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MonopolyBoard;