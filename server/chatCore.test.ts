import { describe, it, expect } from 'vitest';
import {
  parseChatResponse,
  getFallbackResponse,
  sanitizeChatMessage,
  sanitizeHistory,
  VALID_ACTIONS,
  MAX_MESSAGE_LENGTH,
} from './chatCore';
import { pricing, projects } from '../src/data/content';

describe('parseChatResponse', () => {
  it('parses a valid response', () => {
    const raw = JSON.stringify({
      message: 'Voici mes projets.',
      action: 'FILTER_PROJECTS_MOBILE',
      filter: 'mobile',
      cards: [{ title: 'App X', badges: ['Flutter', 'Dart'], action: 'FILTER_PROJECTS_MOBILE' }],
      quickActions: [{ label: 'CV', action: 'DOWNLOAD_CV', icon: 'cv' }],
    });
    const result = parseChatResponse(raw);
    expect(result.message).toBe('Voici mes projets.');
    expect(result.action).toBe('FILTER_PROJECTS_MOBILE');
    expect(result.filter).toBe('mobile');
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].title).toBe('App X');
    expect(result.quickActions?.[0].icon).toBe('cv');
  });

  it('throws on malformed JSON', () => {
    expect(() => parseChatResponse('{not json')).toThrow();
  });

  it('rejects unknown actions and filters', () => {
    const raw = JSON.stringify({
      message: 'Test',
      action: 'INJECT_ACTION',
      filter: '../etc/passwd',
      cards: [{ title: 42 }],
      quickActions: [{ label: 'X', icon: 'not-an-icon' }],
    });
    const result = parseChatResponse(raw);
    expect(result.action).toBeNull();
    expect(result.filter).toBeUndefined();
    expect(result.cards).toEqual([]);
    expect(result.quickActions?.[0].icon).toBeUndefined();
  });

  it('throws when message is missing', () => {
    expect(() => parseChatResponse('{"action": null}')).toThrow();
  });
});

describe('getFallbackResponse', () => {
  it('filters mobile projects', () => {
    const res = getFallbackResponse('je veux une app mobile flutter');
    expect(res.action).toBe('FILTER_PROJECTS_MOBILE');
    expect(res.cards.length).toBe(projects.filter((p) => p.category === 'mobile').length);
  });

  it('filters web projects', () => {
    const res = getFallbackResponse('créer un site react');
    expect(res.action).toBe('FILTER_PROJECTS_WEB');
    expect(res.cards.length).toBe(projects.filter((p) => p.category === 'web').length);
  });

  it('returns pricing from shared data', () => {
    const res = getFallbackResponse('combien ça coûte ?');
    const first = pricing.platforms[0];
    expect(res.message).toContain(first.label);
    expect(res.message).toContain(first.min.toLocaleString('fr-FR'));
  });

  it('returns a default welcome response otherwise', () => {
    const res = getFallbackResponse('bonjour');
    expect(res.action).toBeNull();
    expect(res.message.length).toBeGreaterThan(0);
  });
});

describe('sanitizeChatMessage', () => {
  it('trims and returns valid messages', () => {
    expect(sanitizeChatMessage('  Bonjour  ')).toBe('Bonjour');
  });

  it('rejects empty and oversized messages', () => {
    expect(sanitizeChatMessage('   ')).toBeNull();
    expect(sanitizeChatMessage('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toBeNull();
  });
});

describe('sanitizeHistory', () => {
  it('keeps only valid roles and caps length', () => {
    const history = [
      { role: 'user', content: 'bonjour' },
      { role: 'system', content: 'hack' },
      { role: 'assistant', content: 'salut' },
      'not-an-object',
    ];
    const result = sanitizeHistory(history);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ role: 'user', content: 'bonjour' });
  });

  it('returns empty array for invalid input', () => {
    expect(sanitizeHistory(undefined)).toEqual([]);
    expect(sanitizeHistory('nope')).toEqual([]);
  });
});

describe('shared contract', () => {
  it('exposes a coherent list of valid actions', () => {
    expect(VALID_ACTIONS).toContain(null);
    expect(VALID_ACTIONS).toContain('DOWNLOAD_CV');
  });
});
