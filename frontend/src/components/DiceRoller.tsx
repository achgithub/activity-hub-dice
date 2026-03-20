import React, { useState, CSSProperties } from 'react';
import { useActivityHubContext } from 'activity-hub-sdk';

interface DiceRollerProps {
  maxDice?: number;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ maxDice = 6 }) => {
  const { user } = useActivityHubContext();
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

  // Minimal inline styles for just the dice board animations
  const diceStyles: CSSProperties = {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
    fontSize: '32px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  };

  const rollingDiceStyles: CSSProperties = {
    ...diceStyles,
    transform: `rotate(${Math.random() * 360}deg)`,
    animation: 'spin 0.1s linear',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotateX(0) rotateY(0); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>

      {/* Header */}
      <div className="ah-app-header">
        <div className="ah-app-header-left">
          <h1 className="ah-app-title">🎲 Rrroll the Dice</h1>
        </div>
        <div className="ah-app-header-right">
          <button
            className="ah-btn-outline ah-btn-sm"
            onClick={() => window.location.href = `http://${window.location.hostname}:3001`}
          >
            ← Lobby
          </button>
        </div>
      </div>

      <div className="ah-container ah-container--narrow" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Dice Count Controls */}
        <div className="ah-flex-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
          <button
            className="ah-btn-outline ah-btn-sm"
            onClick={removeDie}
            disabled={numDice <= 1 || isRolling}
          >
            ▼ Remove
          </button>
          <span style={{ fontSize: '1.25rem', fontWeight: '500', minWidth: '80px', textAlign: 'center' }}>
            {numDice} die{numDice !== 1 ? 's' : ''}
          </span>
          <button
            className="ah-btn-outline ah-btn-sm"
            onClick={addDie}
            disabled={numDice >= maxDice || isRolling}
          >
            Add ▲
          </button>
        </div>

        {/* Dice Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          justifyItems: 'center',
        }}>
          {diceValues.map((value, index) => (
            <div key={index} style={isRolling ? rollingDiceStyles : diceStyles}>
              <img
                src={`dice/dice-${value}.png`}
                alt={`dice showing ${value}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
              {/* Fallback emoji - show when image fails or during rolling */}
              {isRolling && (
                <span style={{ fontSize: '2rem' }}>
                  {diceEmojis[value - 1]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Roll Button */}
        <button
          className={isRolling ? 'ah-btn-outline' : 'ah-btn-primary'}
          onClick={rollDice}
          disabled={isRolling}
          style={{ alignSelf: 'center', marginBottom: '2rem', minWidth: '150px', fontSize: '1.1rem', padding: '0.75rem 2rem' }}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>

        {/* Total Display */}
        {!isRolling && numDice > 0 && (
          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2196F3',
            marginBottom: '2rem',
          }}>
            Total: {total}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoller;
