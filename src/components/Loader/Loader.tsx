import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFlagCheckered } from 'react-icons/fa6';
import styles from './Loader.module.css';

interface LoaderProps {
  onComplete?: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = 'loader-seen-v1';
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    // 20ms * 100 steps = 2000ms = 2.0s total duration
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem(STORAGE_KEY, '1');
          setTimeout(() => {
            setIsFinished(true);
            onComplete?.();
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusText = (prog: number) => {
    if (prog < 30) return 'Initialisation de la stack...';
    if (prog < 65) return 'Chargement des projets React & Flutter...';
    if (prog < 90) return 'Connexion à Supabase & IA...';
    return 'Ligne d’arrivée atteinte ! 🚀';
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        >
            <div className={styles.loaderContent}>
            <img src="/img/logo.png" alt="Logo KevCompilePas" className={styles.loaderLogo} />
            {/* Header */}
            <div className={styles.brandTitle}>
              <span className={styles.brandName}>KevCompilePas</span>
            </div>

            {/* Race Track Container */}
            <div className={styles.trackContainer}>
              {/* Progress Line */}
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />

              {/* Running Character (Bonhomme orienté vers la droite) */}
              <div
                className={styles.runnerWrapper}
                style={{ left: `${Math.min(progress, 92)}%` }}
              >
                <div className={styles.runnerCharacter}>
                  {/* SVG Animated Running Figure Leaning Right */}
                  <svg
                    viewBox="0 0 100 100"
                    className={styles.runnerSvg}
                    aria-label="Bonhomme courant vers la droite"
                  >
                    {/* Head leaning forward right */}
                    <circle cx="58" cy="20" r="11" fill="currentColor" />
                    {/* Torso leaning right */}
                    <path
                      d="M56 30 L44 58"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Arms (Running motion forward right) */}
                    <path
                      className={styles.armRight}
                      d="M52 36 L75 42 L88 32"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      className={styles.armLeft}
                      d="M52 36 L32 46 L20 38"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Legs (Sprinting motion forward right) */}
                    <path
                      className={styles.legRight}
                      d="M44 58 L68 72 L85 86"
                      stroke="currentColor"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      className={styles.legLeft}
                      d="M44 58 L25 72 L12 65"
                      stroke="currentColor"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Finish Line (Ligne d'arrivée) */}
              <div className={`${styles.finishLine} ${progress >= 100 ? styles.finishReached : ''}`}>
                <FaFlagCheckered className={styles.flagIcon} />
                <span className={styles.finishText}>ARRIVÉE</span>
              </div>
            </div>

            {/* Footer Stats & Text */}
            <div className={styles.loaderFooter}>
              <span className={styles.statusText}>{getStatusText(progress)}</span>
              <span className={styles.percentText}>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
