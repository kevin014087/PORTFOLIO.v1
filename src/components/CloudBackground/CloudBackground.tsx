import { useEffect, useRef } from 'react';
import styles from './CloudBackground.module.css';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const BLOB_IDS = [1, 2, 3, 4, 5] as const;

export function CloudBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onVisibilityChange = () => {
      wrapper.classList.toggle(styles.paused, document.hidden);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.wrapper} ref={wrapperRef} aria-hidden="true">
      {BLOB_IDS.map((id) => (
        <div key={id} className={styles[`blob${id}`]} />
      ))}
    </div>
  );
}
