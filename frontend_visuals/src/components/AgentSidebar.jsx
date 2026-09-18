import React from 'react';
import './AgentSidebar.css';

export default function AgentSidebar({ agent, onClose }) {
  if (!agent) return null;

  return (
    <aside className="glass-panel agent-sidebar">
      <div className="sidebar-header">
        <h2>{agent.name}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="agent-stats">
        <div className="stat-row">
          <span>Happiness</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(agent.happiness / 10) * 100}%`, background: 'var(--accent-lime)' }}
            ></div>
          </div>
          <span>{agent.happiness}/10</span>
        </div>
        
        <div className="stat-row">
          <span>Hunger</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(agent.hunger / 100) * 100}%`, background: 'var(--accent-danger)' }}
            ></div>
          </div>
          <span>{agent.hunger}/100</span>
        </div>
      </div>

      <div className="thought-feed-container">
        <h3>Live Thought Feed</h3>
        <div className="thought-feed">
          {agent.recentMemories && agent.recentMemories.length > 0 ? (
            agent.recentMemories.map((mem, index) => (
              <div key={index} className="memory-card">
                <span className="timestamp">{new Date(mem.timestamp).toLocaleTimeString()}</span>
                <p>{mem.event_description}</p>
              </div>
            ))
          ) : (
            <div className="memory-card empty">No recent thoughts.</div>
          )}
        </div>
      </div>
    </aside>
  );
}
