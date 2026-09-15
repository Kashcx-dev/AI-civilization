-- AI Civilization Database Schema

CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    happiness INTEGER DEFAULT 5,
    hunger INTEGER DEFAULT 0,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    event_description TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    importance INTEGER DEFAULT 1,
    FOREIGN KEY (agent_id) REFERENCES agents (id)
);

CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id_1 TEXT NOT NULL,
    agent_id_2 TEXT NOT NULL,
    relationship_type TEXT NOT NULL, -- e.g., 'friend', 'enemy', 'stranger'
    trust_level INTEGER DEFAULT 5,
    FOREIGN KEY (agent_id_1) REFERENCES agents (id),
    FOREIGN KEY (agent_id_2) REFERENCES agents (id)
);
