import { Router } from 'express';
import { getAgents } from '../handlers/agentHandler';

const router = Router();

router.get('/agents', getAgents);

export default router;
