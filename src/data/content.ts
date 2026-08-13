export interface Project {
  id: string;
  title: string;
  category: 'web' | 'mobile';
  tags: string[];
  gradient: string;
  liveUrl: string;
  codeUrl: string;
  description?: string;
  highlights?: string[];
  metrics?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  stars: number;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
}

export interface Note {
  id?: string;
  title: string;
  excerpt: string;
  date: string;
  content?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'tiktok' | 'facebook' | 'x' | 'whatsapp' | 'linkedin' | 'github';
}

export interface Stat {
  label: string;
  value: string;
}

export interface ServiceItem {
  title: string;
  summary: string;
  details: string;
}

export const socialLinks: SocialLink[] = [
  { label: 'TikTok', href: 'https://www.tiktok.com/@kevcompilepas', icon: 'tiktok' },
  { label: 'Facebook', href: 'https://facebook.com/kevcompilepas', icon: 'facebook' },
  { label: 'X', href: 'https://x.com/kevcompilepas', icon: 'x' },
  { label: 'WhatsApp', href: 'https://wa.me/2250140448289', icon: 'whatsapp' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bassole-eric-kevin', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/kevcompilepas', icon: 'github' },
];

export const navLinks = [
  { label: 'À propos', href: '#about' },
  { label: 'Projets', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Devis', href: '#estimator' },
  { label: 'Avis', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export const pricing = {
  currency: 'FCFA',
  platforms: [
    { id: 'web', label: 'Site / App Web (React / Next.js)', min: 150000 },
    { id: 'mobile', label: 'App Mobile iOS & Android (Flutter)', min: 250000 },
    { id: 'fullstack', label: 'Solution Fullstack (Web + Mobile + API)', min: 400000 },
  ],
} as const;

export const stats: Stat[] = [
  { value: '4+', label: "Années d'expérience" },
  { value: '15+', label: 'Projets livrés' },
  { value: '08', label: 'Clients satisfaits' },
  { value: '09', label: 'Technologies maîtrisées' },
];

export const skills = [
  { name: 'HTML', label: 'HTML5' },
  { name: 'CSS', label: 'CSS3' },
  { name: 'JavaScript', label: 'JavaScript' },
  { name: 'React', label: 'React' },
  { name: 'Next.js', label: 'Next.js' },
  { name: 'Flutter', label: 'Flutter' },
  { name: 'Python', label: 'Python' },
  { name: 'SQL', label: 'SQL' },
  { name: 'Supabase', label: 'Supabase' },
];

export const workSteps = [
  {
    title: 'Comprendre',
    description:
      'J\'échange avec vous pour cerner le vrai besoin avant d\'écrire une ligne de code.',
  },
  {
    title: 'Construire',
    description:
      'Développement itératif, points réguliers, priorité à ce qui apporte de la valeur vite.',
  },
  {
    title: 'Livrer & suivre',
    description:
      'Mise en ligne propre, documentation claire, et disponibilité après livraison.',
  },
];

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Plateforme Web & SaaS — React + Supabase',
    category: 'web',
    tags: ['React', 'Supabase', 'UI/UX', 'TypeScript'],
    gradient: 'linear-gradient(135deg, #0f172a, #312e81 60%, #7c3aed)',
    liveUrl: '#contact',
    codeUrl: 'https://github.com/kevcompilepas',
    description: 'Une plateforme d’analyse et de gestion centralisée pour PME avec authentification Supabase, base de données temps réel et dashboards réactifs.',
    highlights: [
      'Architecture modulaire React & TypeScript',
      'Row Level Security (RLS) Supabase pour une sécurité maximale',
      'Tableau de bord interactif avec temps de chargement < 0.5s'
    ],
    metrics: '+40% de productivité client'
  },
  {
    id: 'project-2',
    title: 'App Mobile Cross-platform — Flutter + SQL',
    category: 'mobile',
    tags: ['Flutter', 'SQL', 'Mobile', 'Dart'],
    gradient: 'linear-gradient(135deg, #1f2937, #0f766e 45%, #14b8a6)',
    liveUrl: '#contact',
    codeUrl: 'https://github.com/kevcompilepas',
    description: 'Application mobile de gestion de stock et ventes hors-ligne synchronisée automatiquement avec une base SQL distante dès la reconnexion.',
    highlights: [
      'Mode hors-ligne natif avec SQLite local',
      'Interface fluide 60fps sur Android et iOS',
      'Système de notification push et scanner QR'
    ],
    metrics: '99.9% de disponibilité hors-ligne'
  },
  {
    id: 'project-3',
    title: 'Solution E-commerce & SaaS — Next.js + Python',
    category: 'web',
    tags: ['Next.js', 'Python', 'SaaS', 'FastAPI'],
    gradient: 'linear-gradient(135deg, #111827, #9d174d 45%, #f59e0b)',
    liveUrl: '#contact',
    codeUrl: 'https://github.com/kevcompilepas',
    description: 'API d’automatisation et portail SaaS alimenté par Python/FastAPI et un frontend serveur Next.js avec rendu ultra-rapide (SSR).',
    highlights: [
      'API RESTful Python documentée avec Swagger',
      'SEO optimisé et score Google Lighthouse de 98+',
      'Intégration de paiement et gestion d’abonnements'
    ],
    metrics: 'SSR ultra-rapide < 200ms'
  },
  {
    id: 'project-4',
    title: 'App Mobile Realtime — Flutter + Supabase',
    category: 'mobile',
    tags: ['Flutter', 'Supabase', 'Realtime', 'WebSockets'],
    gradient: 'linear-gradient(135deg, #0f172a, #2563eb 45%, #7c3aed)',
    liveUrl: '#contact',
    codeUrl: 'https://github.com/kevcompilepas',
    description: 'Application mobile collaborative en temps réel avec messagerie instantanée, notifications et synchronisation de données multi-utilisateurs.',
    highlights: [
      'Canaux WebSockets Supabase Realtime',
      'UX soignée avec micro-animations Framer-style',
      'Gestion multi-tenant'
    ],
    metrics: 'Latence temps réel < 50ms'
  },
];

export const services: ServiceItem[] = [
  {
    title: 'Développement web',
    summary:
      'Sites et applications web sur mesure avec React, Next.js, HTML/CSS/JS — rapides, responsives et connectées.',
    details:
      "Je conçois des interfaces modernes, des expériences fluides et des intégrations fiables avec Supabase ou des bases SQL.",
  },
  {
    title: 'Développement mobile',
    summary:
      'Applications mobiles multiplateformes avec Flutter, connectées à des API et des bases de données en temps réel.',
    details:
      'Je livre des applications mobiles performantes, ergonomiques et faciles à maintenir sur Android et iOS.',
  },
  {
    title: 'Backend & base de données',
    summary:
      'Conception d’API, logique métier en Python, modélisation et gestion de bases SQL / Supabase.',
    details:
      'Je structure des backends solides et des bases de données claires pour des produits fiables et évolutifs.',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Marc Duprès',
    role: 'Fondateur & CTO',
    company: 'Volska Media',
    content: 'Kevin a transformé notre vision en une application d\'une fluidité exemplaire. Sa rigueur sur le code et son sens du détail font toute la différence.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    stars: 5,
  },
  {
    id: 't2',
    name: 'Sarah Benali',
    role: 'Product Manager',
    company: 'SaaS Flow',
    content: 'Un développeur fullstack réactif et force de proposition ! Il ne se contente pas de coder, il comprend les enjeux business du projet.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    stars: 5,
  },
  {
    id: 't3',
    name: 'Jean-Yves Kouassi',
    role: 'Lead Architect',
    company: 'Tech Solutions',
    content: 'Travail remarquable sur notre application mobile Flutter. Délais respectés, architecture propre et maintenable.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    stars: 5,
  },
];

export const experiences: ExperienceItem[] = [
  {
    company: 'Volska Média',
    role: 'Développeur Lead Fullstack & Mobile',
    period: '2024 – Présent',
  },
  {
    company: 'Agence Digital Tech',
    role: 'Développeur Frontend React & Next.js',
    period: '2022 – 2024',
  },
  {
    company: 'Startup Mobile Labs',
    role: 'Développeur Flutter & Backend Python',
    period: '2021 – 2022',
  },
];

export const notes: Note[] = [
  {
    id: 'note-1',
    title: 'Pourquoi Supabase pour un projet solo',
    excerpt: "Retour d'expérience sur l'auth, la base Postgres et les fonctions edge.",
    date: 'juin 2026',
    content: `Quand on développe un produit en solo ou en équipe réduite, le temps passé à configurer l'infrastructure backend est autant de temps perdu sur la valeur produit.

Après avoir testé Firebase, Firebase Admin et des backends Node/Express personnalisés sur plusieurs projets, mon choix s'est stabilisé sur **Supabase**.

### Les 3 atouts majeurs de Supabase :
1. **Une vraie base PostgreSQL** : Contrairement aux bases NoSQL orientées documents, Postgres apporte la puissance des requêtes relationnelles, des contraintes d'intégrité et des clés étrangères.
2. **Row Level Security (RLS)** : La sécurité est directement gérée au niveau de la base de données via des politiques SQL. Plus besoin d'écrire du boilerplate de vérification de droits dans chaque endpoint API.
3. **Subscriptions en Temps Réel** : Un simple \`supabase.channel()\` permet d'écouter les modifications de tables en WebSockets sans serveur d'événements externe.

En résumé, Supabase divise par 3 le temps de mise en production d'un MVP fullstack tout en gardant une base de données ouverte et standard.`,
  },
  {
    id: 'note-2',
    title: 'Flutter vs React Native en 2026',
    excerpt: 'Ce que j’ai appris en livrant une app mobile de bout en bout.',
    date: 'mai 2026',
    content: `Le choix entre Flutter et React Native est un éternel débat. En ayant conçu et livré des applications en production avec les deux frameworks, voici mon bilan pratique.

### Pourquoi Flutter brille sur le mobile :
- **Consistance visuelle garantie** : Grâce à son propre moteur de rendu (Skia / Impeller), Flutter dessine chaque pixel. L'application est rigoureusement identique sur un iPhone 15 et un smartphone Android d'entrée de gamme.
- **Performances constantes (60 à 120 FPS)** : Pas de pont binaire JS/Native qui ralentit les listes lourdes ou les animations complexes.
- **L'écosystème Dart** : Typage fort, null-safety stricte par défaut et compilation AOT (Ahead-Of-Time).

### Dans quel cas choisir React Native ?
React Native reste un choix judicieux si votre équipe est déjà experte en React Web et souhaite partager du code métier JS/TS. Mais pour une application où la fluidité graphique et les animations complexes priment, **Flutter conserve une nette longueur d'avance**.`,
  },
  {
    id: 'note-3',
    title: 'Structurer une API Next.js proprement',
    excerpt: 'Organisation des routes, validation, et bonnes pratiques.',
    date: 'avril 2026',
    content: `Avec l'App Router de Next.js, créer des Route Handlers (\`app/api/.../route.ts\`) est devenu extrêmement rapide. Mais sans structure claire, le code devient vite difficile à maintenir.

### Mes 4 règles d'or pour une API Next.js propre :

1. **Séparer la logique métier des routes** : Les Route Handlers doivent seulement extraire la requête, appeler un service ou cas d'usage, et retourner une réponse JSON formatée.
2. **Validation stricte avec Zod** : Ne faites jamais confiance aux entrées utilisateurs. Validez le body et les query params systématiquement avec un schéma Zod.
3. **Gestion centralisée des erreurs** : Utilisez un wrapper d'erreur personnalisé qui transforme les exceptions métier en réponses HTTP 400/401/404/500 cohérentes.
4. **Typage des réponses** : Exportez des types TypeScript partagés entre le frontend et le backend pour éviter toute régression.`,
  },
];

export const cvData = {
  name: 'BASSOLE Eric Kevin (KevCompilePas)',
  title: 'Développeur Fullstack & Mobile (React, Next.js, Flutter, Python)',
  summary: 'Passionné par le développement d’applications modernes, performantes et sécurisées. Plus de 4 ans d’expérience en création de plateformes web et mobiles.',
  skills: ['React / Next.js', 'Flutter / Dart', 'Python / FastAPI', 'TypeScript / JavaScript', 'Supabase / PostgreSQL', 'HTML5 / CSS3 / Tailwind / Modules'],
  experiences: [
    { role: 'Développeur Lead Fullstack', company: 'Volska Média', period: '2024 - Présent', desc: 'Conception et maintenance de plateformes web réactives et applications Flutter.' },
    { role: 'Ingénieur Frontend', company: 'Agence Digital Tech', period: '2022 - 2024', desc: 'Développement d’interfaces SaaS et optimisation des performances web.' },
  ],
  education: 'Master / Licence en Génie Logiciel & Informatique',
  email: 'bassolekevin022@gmail.com',
  phone: '+225 01 40 44 82 89',
};

export const chatAssistant = {
  name: 'Éric',
  subtitle: 'Assistant de Kevin · En ligne',
  welcome:
    "Bonjour ! Je m'appelle Éric, l'assistant de Kevin (KevCompilePas). Posez-moi vos questions sur ses projets, services ou tarifs — je peux aussi vous guider sur le site !",
  toggleOpen: 'Parler à Éric',
  toggleClose: 'Fermer',
};
