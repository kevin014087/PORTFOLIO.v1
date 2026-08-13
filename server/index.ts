import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './systemPrompt';
import {
  parseChatResponse,
  getFallbackResponse,
  sanitizeChatMessage,
  sanitizeHistory,
  MAX_MESSAGE_LENGTH,
} from './chatCore';
import type { ChatRequestBody } from './types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Veuillez patienter une minute avant de réessayer.' },
});

app.use(cors({ origin: isProduction ? false : true }));
app.use(express.json({ limit: '32kb' }));

app.post('/api/chat', chatLimiter, async (req, res) => {
  const { message, history = [] } = req.body as ChatRequestBody;

  const sanitized = sanitizeChatMessage(message);
  if (!sanitized) {
    res.status(400).json({
      error: `Le champ "message" est requis et doit faire au plus ${MAX_MESSAGE_LENGTH} caractères.`,
    });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn('[POST /api/chat] GROQ_API_KEY non renseignée. Mode réponse de secours activé.');
    res.json(getFallbackResponse(sanitized));
    return;
  }

  try {
    const safeHistory = sanitizeHistory(history);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...safeHistory.map((item) => ({ role: item.role, content: item.content })),
        { role: 'user', content: sanitized },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Réponse vide du modèle Groq.');
    }

    const payload = parseChatResponse(content);
    res.json(payload);
  } catch (error) {
    console.error('[POST /api/chat] Erreur Groq, basculement vers le mode secours :', error);
    res.json(getFallbackResponse(sanitized));
  }
});

if (isProduction) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] API prête sur http://0.0.0.0:${PORT}`);
});
