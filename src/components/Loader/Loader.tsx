import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Loader.module.css';
import { useI18n } from '../../i18n';

interface LoaderProps {
  onComplete?: () => void;
}

const THRESHOLDS = [25, 55, 85, 100] as const;

export function Loader({ onComplete }: LoaderProps) {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const lines = [t.loader.line1, t.loader.line2, t.loader.line3, t.loader.line4];
  const visibleLines = THRESHOLDS.filter((th) => progress >= th).length;
  const allDone = visibleLines === 4;

  // Typewriter display: each visible line shows progressively more characters
  const displayedText = lines.map((text, i) => {
    if (i >= visibleLines) return '';
    if (i < visibleLines - 1 || allDone) return text;
    // Current line: reveal characters based on progress within the threshold range
    const prevThreshold = i === 0 ? 0 : THRESHOLDS[i - 1];
    const range = THRESHOLDS[i] - prevThreshold;
    const localProgress = (progress - prevThreshold) / range;
    const chars = Math.ceil(localProgress * text.length);
    return text.slice(0, chars);
  });

  useEffect(() => {
    if (reducedMotion.current) {
      setProgress(100);
      setTimeout(() => {
        setIsFinished(true);
        onComplete?.();
      }, 100);
      return;
    }

    // 30ms * 100 steps = 3000ms total
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            onComplete?.();
          }, 400);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className={styles.terminal}>
            {/* Top bar */}
            <div className={styles.terminalBar}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#febc2e' }} />
              <span className={styles.dot} style={{ background: '#28c840' }} />
              <span className={styles.barTitle}>kevcompilepas portfolio</span>
            </div>

            {/* Terminal body */}
            <div className={styles.terminalBody}>
              {lines.map((line, i) => {
                const isVisible = i < visibleLines;
                const isCurrent = i === visibleLines - 1 && !allDone;
                return (
                  <motion.div
                    key={i}
                    className={`${styles.terminalLine} ${isVisible ? styles.done : ''}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <span>{displayedText[i]}</span>
                    {isCurrent && <span className={styles.cursor}>█</span>}
                    {isVisible && <span className={styles.check}>{t.loader.ready}</span>}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className={styles.progressWrap}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <span className={styles.statusText}>
                {allDone ? t.loader.line4 : lines[Math.min(visibleLines, 3)]}
              </span>
              <span className={styles.percentText}>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
