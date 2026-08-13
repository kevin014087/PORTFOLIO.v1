import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const interactiveSelectors = ['a', 'button', 'input', 'textarea', 'select', '[role="button"]'];

export function CustomCursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ringX = useSpring(mouseX, { stiffness: 280, damping: 26 });
  const ringY = useSpring(mouseY, { stiffness: 280, damping: 26 });

  useEffect(() => {
    if (prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) {
      setEnabled(false);
      return;
    }

    setEnabled(true);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = interactiveSelectors.some((selector) => target.closest(selector));
      setHovering(isInteractive);
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = interactiveSelectors.some((selector) => target.closest(selector));
      if (!isInteractive) {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <motion.div
        className={styles.ring}
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovering ? 1.6 : 1 }}
        transition={{ type: 'spring', stiffness: 210, damping: 22 }}
      />
      <motion.div className={styles.dot} style={{ x: mouseX, y: mouseY }} />
    </>
  );
}
