import React from 'react';
import './Header.css';

export default function Header({ stats }) {
  return (
    <header className="glass-panel app-header">
      <div className="brand">
        <h1>AI <span>Civilization</span></h1>
        <div className="badge">v0.1</div>
      </div>
      
      <div className="stats-container">
        <div className="stat-box">
          <span className="label">Agents Alive</span>
          <span className="value text-cyan">{stats?.alive || 0}</span>
        </div>
        <div className="stat-box">
          <span className="label">Avg Happiness</span>
          <span className="value text-lime">{stats?.avgHappiness || 0}</span>
        </div>
        <div className="stat-box">
          <span className="label">Simulation Tick</span>
          <span className="value">{stats?.tick || 0}</span>
        </div>
      </div>
      
      <div className="controls">
        <button className="glass-btn active">Running</button>
      </div>
    </header>
  );
}
