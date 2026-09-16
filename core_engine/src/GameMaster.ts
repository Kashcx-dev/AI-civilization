import db from './database';
import { agentApp } from './AgentGraph';
import { SimulationServer } from './server';

export class GameMaster {
  private tickRateMs = 5000; // 5 seconds per tick
  private isRunning = false;
  private server: SimulationServer;

  constructor(server: SimulationServer) {
    this.server = server;
  }

  public async start() {
    this.isRunning = true;
    console.log("GameMaster started. Simulation is running.");
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    console.log("GameMaster stopped.");
  }

  private async loop() {
    while (this.isRunning) {
      console.log(`\n--- Tick Start ---`);
      
      // Update global states (e.g. hunger increases over time)
      db.prepare('UPDATE agents SET hunger = hunger + 1').run();

      // Get all agents
      const agents = db.prepare('SELECT id FROM agents').all() as { id: string }[];
      
      // Concurrently run cognitive cycles for all agents
      const agentPromises = agents.map(async (agent) => {
        try {
          await agentApp.invoke({ agentId: agent.id });
        } catch (err) {
          console.error(`Error processing agent ${agent.id}:`, err);
        }
      });

      await Promise.all(agentPromises);
      
      console.log(`--- Tick End ---`);
      
      // Broadcast state to visual interface clients
      this.server.broadcastState();
      
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, this.tickRateMs));
    }
  }
}
