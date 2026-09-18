import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import cors from 'cors';
import http from 'http';
import db from './database';
import apiRoutes from './routes/api';
import { loggerMiddleware } from './middlewares/logger';

export class SimulationServer {
  private wss: WebSocketServer;
  private server: http.Server;
  private app: express.Application;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number) {
    // 1. Setup Express
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(loggerMiddleware);

    // 2. Setup Routes
    this.app.use('/api', apiRoutes);

    // 3. Create HTTP Server
    this.server = http.createServer(this.app);

    // 4. Setup WebSocket Server attached to HTTP Server
    this.wss = new WebSocketServer({ server: this.server });
    
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

    // 5. Start listening
    this.server.listen(port, () => {
      console.log(`HTTP and WebSocket server started on port ${port}`);
    });
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

  // Graceful shutdown helper
  public close() {
    this.wss.close();
    this.server.close();
  }
}
