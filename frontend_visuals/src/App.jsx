import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SimulationMap from './components/SimulationMap';
import AgentSidebar from './components/AgentSidebar';

// Mock Data for Initial Setup
const MOCK_AGENTS = [
  {
    id: 'agent-1',
    name: 'Alpha',
    happiness: 8,
    hunger: 20,
    position_x: 10,
    position_y: 15,
    recentMemories: [
      { timestamp: new Date(Date.now() - 5000), event_description: 'Thought: I am feeling great today. Action: MOVE UP' },
      { timestamp: new Date(Date.now() - 10000), event_description: 'Thought: I see an apple. Action: CONSUME' }
    ]
  },
  {
    id: 'agent-2',
    name: 'Beta',
    happiness: 3,
    hunger: 80,
    position_x: 12,
    position_y: 16,
    recentMemories: [
      { timestamp: new Date(Date.now() - 2000), event_description: 'Thought: I am so hungry, I need food. Action: IDLE' }
    ]
  },
  {
    id: 'agent-3',
    name: 'Gamma',
    happiness: 5,
    hunger: 50,
    position_x: 5,
    position_y: 5,
    recentMemories: []
  }
];

function App() {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [globalStats, setGlobalStats] = useState({ alive: 0, avgHappiness: 0, tick: 0 });

  useEffect(() => {
    // Load mock data on mount
    setAgents(MOCK_AGENTS);
    setGlobalStats({
      alive: MOCK_AGENTS.length,
      avgHappiness: (MOCK_AGENTS.reduce((sum, a) => sum + a.happiness, 0) / MOCK_AGENTS.length).toFixed(1),
      tick: 1042
    });

    // Mock tick simulation
    const interval = setInterval(() => {
      setGlobalStats(prev => ({ ...prev, tick: prev.tick + 1 }));
      
      // Randomly move agents around for visual flair
      setAgents(prev => prev.map(a => ({
        ...a,
        position_x: Math.max(0, Math.min(20, a.position_x + (Math.random() > 0.5 ? 1 : -1))),
        position_y: Math.max(0, Math.min(20, a.position_y + (Math.random() > 0.5 ? 1 : -1))),
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="app-container">
      <Header stats={globalStats} />
      <main className="main-content">
        <SimulationMap 
          agents={agents} 
          onSelectAgent={(agent) => setSelectedAgentId(agent.id)}
          selectedAgentId={selectedAgentId}
        />
        <AgentSidebar 
          agent={selectedAgent} 
          onClose={() => setSelectedAgentId(null)} 
        />
      </main>
    </div>
  );
}

export default App;
