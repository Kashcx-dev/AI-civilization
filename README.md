# AI Civilization

An experimental, fully autonomous simulation where AI agents interact, form memories, and build a society. The core engine is built to maximize individual "free will" and study the psychological dynamics (like the "Happiness Metric" and "Short-Gain-Syndrome").

## Architecture

The project is split into two main components:

### 1. Core Engine (Node.js + LangGraph)
The brain of the simulation, located in `core_engine/`.
- **Database**: Uses `better-sqlite3` to store agents, memories (agent history), and relationships.
- **Simulation Loop**: A `GameMaster` ticks the world forward every 5 seconds.
- **Agent Cognition**: Uses **LangGraph** to give each agent a distinct thought process. Every tick, an agent fetches their state and memories, passes it to a local LLM (Ollama running Llama 3), and decides on an action.
- **WebSocket Server**: Broadcasts the live state of the simulation to the frontend.

### 2. Frontend Visual Interface (Coming Soon)
A web interface to visually observe the agents, their stats, and their real-time thoughts as they interact in the world.

## Progress Checklist
- [x] Define core concepts and mechanics (`idea_flow.md`)
- [x] Setup SQLite Database for Agents, Memories, and Relationships
- [x] Implement LangGraph cognitive loop with Ollama
- [x] Build `GameMaster` simulation loop
- [x] Setup WebSocket server to stream simulation data
- [ ] Create Frontend web application
- [ ] Implement `takePossession` and `harm` actions for agents
- [ ] Render simulation visually
