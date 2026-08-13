# Portfolio KevCompilePas

Portfolio de **BASSOLE Éric Kévin (KevCompilePas)** — Développeur Fullstack & Mobile (React, Next.js, Flutter, Python, Supabase).

## Stack

- **Frontend** : React 19, TypeScript, Vite 5, Framer Motion, CSS Modules
- **Backend** : Express 5, intégration IA via Groq (chatbot assistant)
- **Base de données** : Supabase (formulaire de contact & témoignages)
- **Email** : Web3Forms (optionnel)

## Fonctionnalités

- Chatbot IA « Éric » avec navigation automatique du site, cartes riches et boutons d'action (projets, tarifs, CV, WhatsApp).
- Estimateur de budget en FCFA (injecte le devis dans le formulaire de contact).
- Palette de commandes (`Ctrl/Cmd + K`), thème clair/sombre, curseur personnalisé, mascotte 3D.
- Projets filtrables, modale de détail, témoignages, notes/articles, CV interactif.

## Démarrage

```bash
npm install
cp .env.example .env   # renseigner GROQ_API_KEY et (optionnel) Supabase / Web3Forms
npm run dev            # client Vite (5173) + serveur API (3001)
```

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Lance le client et le serveur en mode dev |
| `npm run build` | Typecheck + build de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Tests unitaires (Vitest) |
| `npm start` | Serveur de production (sert le `dist/`) |

## Configuration (`.env`)

| Variable | Rôle |
| -------- | ---- |
| `GROQ_API_KEY` | Clé API du chatbot (serveur uniquement) |
| `VITE_SUPABASE_URL` | URL du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé anon Supabase (publique) |
| `VITE_WEB3FORMS_ACCESS_KEY` | Clé Web3Forms pour la réception des emails |

Tables Supabase attendues : `messages` (contact), `testimonials` (avis).

## Remarques connues

- Site en SPA (pas de SSR) : le SEO repose sur les meta tags du `index.html`.
- Les images Open Graph pointent vers `/img/profile.jpg` : remplacer par une URL absolue une fois le domaine connu.
