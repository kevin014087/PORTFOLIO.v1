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


export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history
        .filter((item) => item.sender === 'user' || item.sender === 'bot')
        .map((item) => ({
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: item.text,
        })),
    }),
  });

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
