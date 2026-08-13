import { motion } from 'framer-motion';
import styles from './Stats.module.css';
import { stats } from '../../data/content';

export function Stats() {
  return (
    <motion.section
      className={styles.stats}
      id="stats"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
