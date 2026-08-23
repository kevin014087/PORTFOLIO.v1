import { projects, pricing, contentEn } from '../src/data/content';
import type { ChatAction, ChatResponse } from './types';

export const VALID_ACTIONS: ChatAction[] = [
  'NAVIGATE_PROJECTS',
  'FILTER_PROJECTS_MOBILE',
  'FILTER_PROJECTS_WEB',
  'FILTER_PROJECTS_FLUTTER',
  'FILTER_PROJECTS_REACT',
  'NAVIGATE_CONTACT',
  'DOWNLOAD_CV',
  'OPEN_WHATSAPP',
  'NAVIGATE_SERVICES',
  'NAVIGATE_EXPERIENCE',
  'NAVIGATE_TESTIMONIALS',
  null,
];

const VALID_FILTERS = ['all', 'web', 'mobile', 'React', 'Flutter', 'Supabase', 'Python'] as const;
type ValidFilter = (typeof VALID_FILTERS)[number];

const VALID_ICONS = ['cv', 'whatsapp', 'projects', 'contact', 'web', 'mobile', 'email'] as const;

export const MAX_MESSAGE_LENGTH = 2000;

function isChatAction(value: unknown): value is ChatAction {
  return VALID_ACTIONS.includes(value as ChatAction);
}

function isFilter(value: unknown): value is ChatResponse['filter'] {
  return typeof value === 'string' && (VALID_FILTERS as readonly string[]).includes(value);
}

function isIcon(value: unknown): value is ChatResponse['quickActions'][number]['icon'] {
  return typeof value === 'string' && (VALID_ICONS as readonly string[]).includes(value);
}

export function parseChatResponse(raw: string): ChatResponse {
  let parsed: Partial<ChatResponse> & { message?: unknown };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Réponse IA invalide : JSON mal formé.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Réponse IA invalide : objet attendu.');
  }

  const message = typeof parsed.message === 'string' ? parsed.message.trim() : '';
  if (!message) {
    throw new Error('Réponse IA invalide : message manquant');
  }

  const action = isChatAction(parsed.action) ? parsed.action : null;
  const filter = isFilter(parsed.filter) ? parsed.filter : undefined;

  const cards = Array.isArray(parsed.cards)
    ? parsed.cards
        .filter(
          (card): card is Record<string, unknown> =>
            Boolean(card && typeof card === 'object' && typeof (card as { title?: unknown }).title === 'string'),
        )
        .map((card) => ({
          id: typeof card.id === 'string' ? card.id : undefined,
          title: card.title as string,
          description: typeof card.description === 'string' ? card.description : undefined,
          link: typeof card.link === 'string' ? card.link : undefined,
          tag: typeof card.tag === 'string' ? card.tag : undefined,
          badges: Array.isArray(card.badges)
            ? card.badges.filter((b): b is string => typeof b === 'string')
            : undefined,
          action: isChatAction(card.action) ? card.action : undefined,
          filter: isFilter(card.filter) ? card.filter : undefined,
          projectId: typeof card.projectId === 'string' ? card.projectId : undefined,
        }))
    : [];

  const quickActions = Array.isArray(parsed.quickActions)
    ? parsed.quickActions
        .filter(
          (qa): qa is Record<string, unknown> =>
            Boolean(qa && typeof qa === 'object' && typeof (qa as { label?: unknown }).label === 'string'),
        )
        .map((qa) => ({
          label: qa.label as string,
          action: isChatAction(qa.action) ? qa.action : null,
          url: typeof qa.url === 'string' ? qa.url : undefined,
          filter: isFilter(qa.filter) ? qa.filter : undefined,
          icon: isIcon(qa.icon) ? qa.icon : undefined,
        }))
    : [];

  return { message, action, filter, cards, quickActions };
}

function toCard(project: (typeof projects)[number], action: string) {
  return {
    id: project.id,
    title: project.title,
    description: project.description ?? undefined,
    tag: project.category === 'mobile' ? 'Mobile' : 'Web',
    badges: project.tags,
    action,
    filter: project.category,
    projectId: project.id,
  };
}

export function getFallbackResponse(userText: string, lang: 'fr' | 'en' = 'fr'): ChatResponse {
  const text = userText.toLowerCase();
  const isEn = lang === 'en';
  const data = isEn ? contentEn : { projects, pricing };
  const sourceProjects = data.projects;
  const sourcePricing = data.pricing;

  if (text.includes('mobile') || text.includes('flutter') || text.includes('android') || text.includes('ios')) {
    return {
      message: isEn
        ? "Kevin is an expert mobile developer on **Flutter & Dart**. He builds smooth apps (60 FPS) with offline support (SQLite) and real-time synchronization (Supabase).\n\nI have filtered the mobile projects below for you!"
        : "Kevin est un développeur mobile expert sur **Flutter & Dart**. Il crée des apps fluides (60 FPS) avec gestion du mode hors-ligne (SQLite) et synchronisation temps réel (Supabase).\n\nJ'ai automatiquement filtré les projets mobiles ci-dessous !",
      action: 'FILTER_PROJECTS_MOBILE',
      filter: 'mobile',
      cards: sourceProjects.filter((p) => p.category === 'mobile').map((p) => toCard(p, 'FILTER_PROJECTS_MOBILE')),
      quickActions: [
        { label: isEn ? '📱 Discover mobile projects' : '📱 Découvrir les projets mobile', action: 'FILTER_PROJECTS_MOBILE', filter: 'mobile', icon: 'mobile' },
        { label: '💬 WhatsApp', action: 'OPEN_WHATSAPP', url: 'https://wa.me/2250140448289', icon: 'whatsapp' },
      ],
    };
  }

  if (text.includes('web') || text.includes('react') || text.includes('next') || text.includes('site')) {
    return {
      message: isEn
        ? "In web development, Kevin builds modern ultra-fast applications with **React, Next.js, TypeScript** and **Python/Node.js** backends.\n\nI have filtered the portfolio's web projects for you!"
        : "En développement Web, Kevin conçoit des applications modernes ultra-rapides avec **React, Next.js, TypeScript** et des backends **Python/Node.js**.\n\nJ'ai filtré les projets Web du portfolio pour vous !",
      action: 'FILTER_PROJECTS_WEB',
      filter: 'web',
      cards: sourceProjects.filter((p) => p.category === 'web').map((p) => toCard(p, 'FILTER_PROJECTS_WEB')),
      quickActions: [
        { label: isEn ? '🌐 Web & SaaS projects' : '🌐 Projets Web & SaaS', action: 'FILTER_PROJECTS_WEB', filter: 'web', icon: 'web' },
        { label: isEn ? '📄 Download the CV' : '📄 Télécharger le CV', action: 'DOWNLOAD_CV', icon: 'cv' },
      ],
    };
  }

  if (
    text.includes('tarif') ||
    text.includes('prix') ||
    text.includes('price') ||
    text.includes('combien') ||
    text.includes('coût') ||
    text.includes('cout') ||
    text.includes('cost') ||
    text.includes('budget') ||
    text.includes('estimation') ||
    text.includes('estimate')
  ) {
    const priceLines = sourcePricing.platforms
      .map((p) => `• **${p.label}** : from ${p.min.toLocaleString('fr-FR')} ${sourcePricing.currency}`)
      .join('\n');

    return {
      message: isEn
        ? `Here is Kevin's indicative pricing grid in ${sourcePricing.currency}:\n\n${priceLines}`
        : `Voici une grille indicative des tarifs de Kevin en ${sourcePricing.currency} :\n\n${priceLines}`,
      action: 'NAVIGATE_CONTACT',
      cards: [
        {
          title: isEn ? 'Request a Custom Quote' : 'Demander un Devis Personnalisé',
          description: isEn ? 'Contact form with a reply within 24h.' : 'Formulaire de contact avec réponse sous 24h.',
          tag: isEn ? 'Quote' : 'Devis',
          badges: isEn ? ['Direct', 'Free quote'] : ['Direct', 'Devis gratuit'],
          link: '#contact',
          action: 'NAVIGATE_CONTACT',
        },
      ],
      quickActions: [
        { label: isEn ? '📬 Fill the form' : '📬 Remplir le formulaire', action: 'NAVIGATE_CONTACT', icon: 'contact' },
        { label: '💬 WhatsApp Direct', action: 'OPEN_WHATSAPP', url: 'https://wa.me/2250140448289', icon: 'whatsapp' },
      ],
    };
  }

  if (text.includes('cv') || text.includes('curriculum') || text.includes('résumé') || text.includes('resume') || text.includes('télécharger') || text.includes('download')) {
    return {
      message: isEn
        ? "I opened Kevin's interactive CV. You can view it and download it directly!"
        : "J'ai ouvert le CV interactif de Kevin. Vous pouvez le consulter et le télécharger directement !",
      action: 'DOWNLOAD_CV',
      cards: [
        {
          title: 'CV - BASSOLE Eric Kevin',
          description: isEn ? 'Lead Fullstack & Mobile Developer (4+ years experience)' : "Développeur Lead Fullstack & Mobile (4+ ans d'expérience)",
          tag: 'CV',
          badges: ['React', 'Flutter', 'Python', 'Supabase'],
          action: 'DOWNLOAD_CV',
        },
      ],
      quickActions: [
        { label: isEn ? '📄 Download the CV' : '📄 Télécharger le CV', action: 'DOWNLOAD_CV', icon: 'cv' },
        { label: '💬 WhatsApp', action: 'OPEN_WHATSAPP', url: 'https://wa.me/2250140448289', icon: 'whatsapp' },
      ],
    };
  }

  return {
    message: isEn
      ? "Hello! I'm Éric, Kevin's assistant. I can show you his Web & Mobile projects, filter by technology, display his CV or put you directly in touch!"
      : "Bonjour ! Je m'appelle Éric, l'assistant de Kevin. Je peux vous faire découvrir ses projets Web & Mobile, filtrer les technologies, vous montrer son CV ou vous mettre directement en relation !",
    action: null,
    cards: [
      {
        title: isEn ? 'Discover the work' : 'Découvrir les réalisations',
        description: isEn ? 'React, Next.js and Flutter projects' : 'Projets React, Next.js et Flutter',
        tag: isEn ? 'Portfolio' : 'Portfolio',
        badges: ['React', 'Flutter', 'Supabase'],
        action: 'NAVIGATE_PROJECTS',
        filter: 'all',
      },
    ],
    quickActions: [
      { label: isEn ? '📱 Mobile Apps' : '📱 Apps Mobile', action: 'FILTER_PROJECTS_MOBILE', filter: 'mobile', icon: 'mobile' },
      { label: isEn ? '🌐 Web Projects' : '🌐 Projets Web', action: 'FILTER_PROJECTS_WEB', filter: 'web', icon: 'web' },
      { label: isEn ? '📄 Get the CV' : '📄 Obtenir le CV', action: 'DOWNLOAD_CV', icon: 'cv' },
      { label: '💬 WhatsApp', action: 'OPEN_WHATSAPP', url: 'https://wa.me/2250140448289', icon: 'whatsapp' },
    ],
  };
}

export function sanitizeHistory(history: unknown): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (item): item is { role: 'user' | 'assistant'; content: string } =>
        Boolean(
          item &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string' &&
            item.content.trim(),
        ),
    )
    .slice(-10);
}
