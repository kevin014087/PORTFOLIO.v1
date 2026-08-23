import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT, SYSTEM_PROMPT_EN } from './systemPrompt';
import { parseChatResponse, getFallbackResponse, sanitizeHistory, MAX_MESSAGE_LENGTH } from './chatCore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatRequestBodySchema = z.object({
  message: z
    .string({ error: 'Le champ "message" est requis.' })
    .trim()
    .min(1, 'Le champ "message" ne peut pas être vide.')
    .max(MAX_MESSAGE_LENGTH, `Le champ "message" doit faire au plus ${MAX_MESSAGE_LENGTH} caractères.`),
  lang: z.enum(['fr', 'en'], { error: 'Le champ "lang" doit être "fr" ou "en".' }).default('fr'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant'], { error: 'Rôle de message invalide.' }),
        content: z
          .string({ error: 'Contenu de message invalide.' })
          .trim()
          .min(1, 'Contenu de message vide.')
          .max(MAX_MESSAGE_LENGTH, 'Contenu de message trop long.'),
      }),
      { error: 'Le champ "history" doit être un tableau de messages.' },
    )
    .max(20, 'Le champ "history" ne peut pas dépasser 20 messages.')
    .default([]),
});

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
  const validation = chatRequestBodySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.issues[0]?.message ?? 'Corps de requête invalide.' });
    return;
  }

  const { message: sanitized, lang } = validation.data;
  const safeHistory = sanitizeHistory(validation.data.history);

  const systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT;

  if (!process.env.GROQ_API_KEY) {
    console.warn('[POST /api/chat] Service de réponse non configuré, bascule en mode secours.');
    res.json(getFallbackResponse(sanitized, lang));
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
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
    res.json(getFallbackResponse(sanitized, lang));
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
