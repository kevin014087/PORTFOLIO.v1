import type { ChatAction, ChatMessage, ChatResponse } from '../types/chat';

export function executeChatAction(
  action: ChatAction,
  filter?: 'all' | 'web' | 'mobile' | 'React' | 'Flutter' | 'Supabase' | 'Python',
  onOpenCv?: () => void,
  url?: string,
  projectId?: string,
): void {
  if (!action && !filter && !projectId && !url) return;

  if (action === 'OPEN_WHATSAPP' || (url && url.includes('wa.me'))) {
    const targetUrl = url || 'https://wa.me/2250140448289';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  if (action === 'DOWNLOAD_CV') {
    onOpenCv?.();
  }

  if (action === 'OPEN_CONFIGURATOR') {
    // handled via portfolio-autopilot event in App.tsx
  }

  // Dispatch custom autopilot event to update portfolio state (e.g. active filter, modal selection)
  window.dispatchEvent(
    new CustomEvent('portfolio-autopilot', {
      detail: { action, filter, projectId, url },
    }),
  );

  // Smooth scroll to relevant section
  if (action === 'NAVIGATE_PROJECTS' || action?.startsWith('FILTER_PROJECTS') || filter || projectId) {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'NAVIGATE_CONTACT') {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'NAVIGATE_SERVICES') {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'NAVIGATE_EXPERIENCE') {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'NAVIGATE_TESTIMONIALS') {
    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
  }
}


const CHAT_TIMEOUT_MS = 25000;

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  lang: 'fr' | 'en' = 'fr',
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang,
        message,
        history: history
          .filter((item) => item.sender === 'user' || item.sender === 'bot')
          .map((item) => ({
            role: item.sender === 'user' ? 'user' : 'assistant',
            content: item.text,
          })),
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        lang === 'fr'
          ? "L'assistant met trop de temps à répondre. Réessayez dans un instant."
          : "The assistant is taking too long to reply. Please try again in a moment.",
      );
    }
    throw new Error(
      lang === 'fr'
        ? "Impossible de joindre l'assistant. Vérifiez votre connexion."
        : 'Unable to reach the assistant. Check your connection.',
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const data = (await response.json()) as ChatResponse | { error?: string };

  if (!response.ok) {
    throw new Error(
      'error' in data && data.error
        ? data.error
        : 'Erreur lors de la communication avec l\'assistant.',
    );
  }

  return data as ChatResponse;
}
