import React from 'react';
import ReactDOM from 'react-dom/client';
// NOTE: Shared Activity Hub CSS is auto-loaded by activity-hub-sdk
import './styles/dice-board.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
