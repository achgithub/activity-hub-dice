import React, { useState } from 'react';
import { useActivityHubContext } from 'activity-hub-sdk';
import '../styles/dice-board.css';

interface DiceRollerProps {
  maxDice?: number;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ maxDice = 6 }) => {
  const { user, navigateTo } = useActivityHubContext();
  const [numDice, setNumDice] = useState(1);
  const [diceValues, setDiceValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = async () => {
    if (isRolling) return;

    setIsRolling(true);

    // Animate dice for 2 seconds
    const duration = 2000;
    const interval = 100;
    const cycles = duration / interval;
    let cycle = 0;

    const rollInterval = setInterval(() => {
      // Update all dice with random values
      const newValues = Array.from({ length: numDice }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      setDiceValues(newValues);

      cycle++;
      if (cycle >= cycles) {
        clearInterval(rollInterval);

        // Set final values
        const finalValues = Array.from({ length: numDice }, () =>
          Math.floor(Math.random() * 6) + 1
        );
        setDiceValues(finalValues);
        setIsRolling(false);
      }
    }, interval);
  };

  const addDie = () => {
    if (numDice < maxDice) {
      const newCount = numDice + 1;
      setNumDice(newCount);
      setDiceValues([...diceValues, 1]);
    }
  };

  const removeDie = () => {
    if (numDice > 1) {
      const newCount = numDice - 1;
      setNumDice(newCount);
      setDiceValues(diceValues.slice(0, newCount));
    }
  };

  const total = diceValues.reduce((sum, val) => sum + val, 0);

  const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  return (
    <div className="dice-roller-container">
      {/* Header */}
      <div className="ah-app-header">
        <div className="ah-app-header-left">
          <h1 className="ah-app-title">🎲 Rrroll the Dice</h1>
        </div>
        <div className="ah-app-header-right">
          <button
            className="ah-lobby-btn"
            onClick={() => navigateTo('/lobby')}
          >
            ← Lobby
          </button>
        </div>
      </div>

      <div className="ah-container ah-container--narrow">
        {/* Dice Count Controls */}
        <div className="dice-controls">
          <button
            className="ah-btn-outline ah-btn-sm"
            onClick={removeDie}
            disabled={numDice <= 1 || isRolling}
            title="Remove a die"
          >
            ▼
          </button>
          <span className="dice-count">{numDice} die{numDice !== 1 ? 's' : ''}</span>
          <button
            className="ah-btn-outline ah-btn-sm"
            onClick={addDie}
            disabled={numDice >= maxDice || isRolling}
            title="Add a die"
          >
            ▲
          </button>
        </div>

        {/* Dice Display */}
        <div className="dice-container">
          {diceValues.map((value, index) => (
            <div
              key={index}
              className={`dice ${isRolling ? 'rolling' : 'settled'}`}
            >
              {/* Try to load PNG image, fallback to emoji */}
              <img
                src={`/dice/dice-${value}.png`}
                alt={`dice showing ${value}`}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  img.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className={`dice-fallback ${!isRolling ? 'hidden' : ''}`}>
                {diceEmojis[value - 1]}
              </div>
            </div>
          ))}
        </div>

        {/* Roll Button */}
        <button
          className={`dice-roll-button ${isRolling ? 'ah-btn-outline' : 'ah-btn-primary'}`}
          onClick={rollDice}
          disabled={isRolling}
        >
          {isRolling ? 'Rolling...' : 'Roll'}
        </button>

        {/* Total Display */}
        {!isRolling && numDice > 0 && (
          <div className="dice-total">Total: {total}</div>
        )}

        {/* User Info - Debug */}
        {user && (
          <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#999' }}>
            <p>Logged in as: {user.name || user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
