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
                {property.id === 0 && <span className="go-arrow">GO</span>}
                {property.id === 10 && <span className="jail-icon">JAIL</span>}
                {property.id === 20 && <span className="parking-icon">FREE<br/>PARKING</span>}
                {property.id === 30 && <span className="go-to-jail-icon">GO TO<br/>JAIL</span>}
              </div>
            </div>
          ) : (
            <>
              <div className="property-name">{property.name}</div>
              {property.price && (
                <div className="property-price">₹{property.price}</div>
              )}
              {property.type === 'railroad' && <div className="property-icon">🚂</div>}
              {property.type === 'utility' && <div className="property-icon">⚡</div>}
              {property.type === 'chance' && <div className="property-icon">?</div>}
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
        {/* Center area - Exact replica of the image */}
        <div className="board-center">
          <div className="center-logo">
            <h1 className="monopoly-title">MONOPOLY</h1>
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
          background: #1a472a;
          border: 8px solid #d4af37;
          border-radius: 12px;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.6),
            inset 0 0 50px rgba(212, 175, 55, 0.2);
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
          background: #1a472a;
          border: 4px solid #d4af37;
          border-radius: 8px;
          margin: 10px;
          position: relative;
        }

        .center-logo {
          text-align: center;
        }

        .monopoly-title {
          font-size: 48px;
          font-weight: bold;
          color: #d4af37;
          text-shadow: 
            0 0 20px rgba(212, 175, 55, 0.8),
            2px 2px 4px rgba(0,0,0,0.8);
          letter-spacing: 4px;
          margin: 0;
          font-family: 'Times New Roman', serif;
        }

        .property-space {
          background: #2d5a3d;
          border: 2px solid #d4af37;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .property-space:hover {
          transform: scale(1.05);
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.4),
            0 0 20px rgba(212, 175, 55, 0.4);
          z-index: 10;
          background: #3a6b4a;
        }

        .corner-space {
          width: 120px;
          height: 120px;
          background: #1a472a;
          border: 3px solid #d4af37;
        }

        .corner {
          grid-column: span 1;
          grid-row: span 1;
        }

        .bottom-right-corner {
          grid-column: 11;
          grid-row: 11;
          border-radius: 0 0 8px 0;
        }

        .bottom-left-corner {
          grid-column: 1;
          grid-row: 11;
          border-radius: 0 0 0 8px;
        }

        .top-left-corner {
          grid-column: 1;
          grid-row: 1;
          border-radius: 8px 0 0 0;
        }

        .top-right-corner {
          grid-column: 11;
          grid-row: 1;
          border-radius: 0 8px 0 0;
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
          background: #2d5a3d;
        }

        .corner-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }

        .go-arrow {
          font-size: 24px;
          font-weight: bold;
          color: #d4af37;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
        }

        .jail-icon {
          font-size: 12px;
          font-weight: bold;
          color: #d4af37;
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.8);
        }

        .parking-icon {
          font-size: 10px;
          font-weight: bold;
          color: #d4af37;
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.8);
          line-height: 1.2;
        }

        .go-to-jail-icon {
          font-size: 9px;
          font-weight: bold;
          color: #d4af37;
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.8);
          line-height: 1.2;
        }

        .property-name {
          font-size: 9px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 3px;
          line-height: 1.1;
          color: #d4af37;
          text-shadow: 0 0 3px rgba(212, 175, 55, 0.6);
        }

        .property-price {
          font-size: 8px;
          color: #ffffff;
          text-align: center;
          font-weight: 600;
        }

        .property-icon {
          font-size: 14px;
          margin-top: 2px;
          color: #d4af37;
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
          border: 2px solid #d4af37;
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