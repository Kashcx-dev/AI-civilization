import { StateGraph, Annotation } from '@langchain/langgraph';
import { Ollama } from '@langchain/ollama';
import db from './database';

// Define the Graph State
export const AgentState = Annotation.Root({
  agentId: Annotation<string>(),
  currentState: Annotation<any>(),
  recentMemories: Annotation<any[]>(),
  decision: Annotation<any>(),
});

// Initialize the Ollama model
const llm = new Ollama({
  baseUrl: "http://localhost:11434", // Default Ollama port
  model: "llama3", // or "phi3" for faster local inferences
});

// Node: Fetch State
async function fetchState(state: typeof AgentState.State) {
  const agentId = state.agentId;
  const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
  return { currentState: agent };
}

// 3. Node: Fetch Memories
async function fetchMemories(state: typeof AgentState.State) {
  const memories = db.prepare(
    'SELECT * FROM memories WHERE agent_id = ? ORDER BY timestamp DESC LIMIT 5'
  ).all(state.agentId);
  return { recentMemories: memories };
}

// Node: Think (LLM call)
async function think(state: typeof AgentState.State) {
  const prompt = `
    You are an autonomous AI Agent in a simulation.
    Your ID is ${state.agentId}.
    Your current stats: ${JSON.stringify(state.currentState)}
    Your recent memories: ${JSON.stringify(state.recentMemories)}
    
    Based on your stats and memories, what is your next thought and action?
    Respond in JSON format: { "thought": "your internal monologue", "action": "what you do next" }
  `;

  try {
    const response = await llm.invoke(prompt);
    return { decision: response };
  } catch (error) {
    console.error(`Agent ${state.agentId} LLM Error:`, error);
    return { decision: '{ "thought": "I am confused.", "action": "idle" }' };
  }
}

// Node: Act (Execute and save memory)
async function act(state: typeof AgentState.State) {
  try {
    const decision = typeof state.decision === 'string' ? JSON.parse(state.decision) : state.decision;
    
    // Save thought as a memory
    db.prepare('INSERT INTO memories (agent_id, event_description) VALUES (?, ?)')
      .run(state.agentId, `Thought: ${decision.thought} | Action: ${decision.action}`);

    console.log(`[Agent ${state.agentId}] ${decision.action}`);
  } catch (err) {
    console.error("Failed to parse agent decision:", state.decision);
  }
  return {};
}

// Build the Graph
const workflow = new StateGraph(AgentState)
  .addNode("fetchState", fetchState)
  .addNode("fetchMemories", fetchMemories)
  .addNode("think", think)
  .addNode("act", act)
  .addEdge("__start__", "fetchState")
  .addEdge("fetchState", "fetchMemories")
  .addEdge("fetchMemories", "think")
  .addEdge("think", "act")
  .addEdge("act", "__end__");

export const agentApp = workflow.compile();
