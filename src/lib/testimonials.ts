import { supabase } from './supabase';
import type { Testimonial } from '../data/content';

const STORAGE_KEY = 'portfolio_user_testimonials';

export async function loadUserTestimonials(): Promise<Testimonial[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role,
          company: row.company,
          content: row.content,
          avatar: row.avatar,
          stars: row.stars,
        }));
      }
    } catch {
      // silence: fallback to local storage
    }
  }
  return readLocal();
}

export async function saveUserTestimonial(
  testimonial: Testimonial,
): Promise<{ persistedRemotely: boolean }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('testimonials').insert([
        {
          name: testimonial.name,
          role: testimonial.role,
          company: testimonial.company,
          content: testimonial.content,
          avatar: testimonial.avatar,
          stars: testimonial.stars,
          created_at: new Date().toISOString(),
        },
      ]);
      if (!error) return { persistedRemotely: true };
    } catch {
      // silence: fallback to local storage
    }
  }

  const previous = readLocal();
  writeLocal([testimonial, ...previous]);
  return { persistedRemotely: false };
}

function readLocal(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items: Testimonial[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable: ignore
  }
}
