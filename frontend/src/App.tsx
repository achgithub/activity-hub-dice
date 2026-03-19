import React from 'react';
import { ActivityHubProvider } from 'activity-hub-sdk';
import DiceRoller from './components/DiceRoller';

const App: React.FC = () => {
  return (
    <ActivityHubProvider>
      <DiceRoller maxDice={6} />
    </ActivityHubProvider>
  );
};

export default App;
