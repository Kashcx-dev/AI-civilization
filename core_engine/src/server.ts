import { WebSocketServer, WebSocket } from 'ws';
import db from './database';

export class SimulationServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    
    this.wss.on('connection', (ws) => {
      console.log('New visual interface client connected!');
      this.clients.add(ws);

      // Send initial state immediately
      this.broadcastState();

      ws.on('close', () => {
        console.log('Visual interface client disconnected.');
        this.clients.delete(ws);
      });
    });

    console.log(`WebSocket server started on port ${port}`);
  }

  // Called by GameMaster at the end of every tick
  public broadcastState() {
    if (this.clients.size === 0) return;

    try {
      const agents = db.prepare('SELECT * FROM agents').all();
      // Fetch latest 20 memories for a global activity feed
      const recentActivity = db.prepare('SELECT * FROM memories ORDER BY timestamp DESC LIMIT 20').all();
      
      const payload = JSON.stringify({
        type: 'TICK_UPDATE',
        agents,
        recentActivity
      });

      for (const client of this.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    } catch (error) {
      console.error('Error broadcasting state:', error);
    }
  }
}
