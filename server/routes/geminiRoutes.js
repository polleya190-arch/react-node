// server/routes/geminiRoutes.js
import express from 'express';
import { getSuggestion } from '../controllers/geminiController.js';

const router = express.Router();
router.post('/gemini-suggestions', getSuggestion);

export default router;
