import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseScrollRevealOptions {
  selector?: string;
  start?: string;
  stagger?: number;
  duration?: number;
  y?: number;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const {
    selector = ':scope > *',
    start = 'top 82%',
    stagger = 0.1,
    duration = 0.8,
    y = 30,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const children = ref.current!.querySelectorAll(selector);
      if (children.length === 0) return;

      gsap.from(children, {
        opacity: 0,
        y,
        duration,
        ease: 'power2.out',
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start,
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [selector, start, stagger, duration, y]);

  return ref;
}
