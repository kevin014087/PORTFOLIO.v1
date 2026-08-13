import { motion } from 'framer-motion';
import styles from './CloudBackground.module.css';

const blobs = [
  { className: styles.blob1, duration: 70, delay: 0 },
  { className: styles.blob2, duration: 82, delay: -12 },
  { className: styles.blob3, duration: 95, delay: -22 },
  { className: styles.blob4, duration: 55, delay: -8 },
  { className: styles.blob5, duration: 78, delay: -18 },
];

export function CloudBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      {blobs.map((blob) => (
        <motion.div
          key={blob.className}
          className={blob.className}
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: blob.delay }}
        />
      ))}
    </div>
  );
}
