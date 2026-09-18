import { Request, Response } from 'express';
import db from '../database';

export const getAgents = (req: Request, res: Response) => {
    try {
        const agents = db.prepare('SELECT * FROM agents').all();
        res.json({ success: true, agents });
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
