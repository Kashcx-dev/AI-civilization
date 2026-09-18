import React from 'react';
import './SimulationMap.css';

export default function SimulationMap({ agents, onSelectAgent, selectedAgentId }) {
  // Helper to determine color based on happiness (0 to 10)
  const getAgentColor = (happiness) => {
    if (happiness >= 8) return 'var(--accent-lime)'; // Happy
    if (happiness >= 4) return 'var(--accent-cyan)'; // Neutral
    return 'var(--accent-danger)'; // Sad
  };

  return (
    <div className="glass-panel simulation-map-container">
      <div className="map-grid">
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          
          // Map coordinates to percentages (assuming a 100x100 grid for this demo)
          // Adjust these multipliers based on actual max X/Y in backend
          const left = `${agent.position_x * 5}%`;
          const top = `${agent.position_y * 5}%`;

          return (
            <div
              key={agent.id}
              className={`agent-token ${isSelected ? 'selected' : ''}`}
              style={{
                left,
                top,
                '--agent-color': getAgentColor(agent.happiness)
              }}
              onClick={() => onSelectAgent(agent)}
              title={agent.name}
            >
              <div className="agent-core"></div>
              {isSelected && <div className="agent-ring"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
