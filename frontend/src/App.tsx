import React from 'react';
import { useActivityHubContext } from 'activity-hub-sdk';
import DiceRoller from './components/DiceRoller';

const App: React.FC = () => {
  const { user } = useActivityHubContext();

  return (
    <>
      {/* Show user info at top */}
      <div className="ah-container">
        <p className="ah-meta">
          {user.isGuest ? 'Playing as Guest' : `Playing as ${user.name || user.email}`}
        </p>
      </div>

      <DiceRoller maxDice={6} />
    </>
  );
};

export default App;
