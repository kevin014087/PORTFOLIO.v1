export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');

export function getSiteOrigin(): string {
  if (SITE_URL) return SITE_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  if (!origin) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isHttpUrl(url?: string): boolean {
  return Boolean(url && /^https?:\/\//i.test(url));
}

export function isCurrentSite(url?: string): boolean {
  return url === '/' || url === '';
}
