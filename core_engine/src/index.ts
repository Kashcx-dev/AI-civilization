import { initializeDatabase } from './database';
import { GameMaster } from './GameMaster';
import { SimulationServer } from './server';
import db from './database';

// 1. Initialize the SQLite Database
initializeDatabase();

// 2. Seed some initial agents if the database is empty
const agentCount = db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
if (agentCount.count === 0) {
    console.log("No agents found. Seeding initial agents...");
    const insertAgent = db.prepare('INSERT INTO agents (id, name) VALUES (?, ?)');
    insertAgent.run('Agent_1', 'Alice');
    insertAgent.run('Agent_2', 'Bob');
    console.log("Seeded Alice and Bob.");
}

// 3. Start the WebSocket Server
const wss = new SimulationServer(8080);

// 4. Start the Simulation
const gm = new GameMaster(wss);
gm.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log("Shutting down...");
    gm.stop();
    db.close();
    process.exit(0);
});
