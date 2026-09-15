import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Initialize SQLite database
const dbPath = path.join(__dirname, '..', 'database', 'civilization.db');
const db = new Database(dbPath);

// Execute schema
export function initializeDatabase() {
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Database initialized successfully.');
}

export default db;
