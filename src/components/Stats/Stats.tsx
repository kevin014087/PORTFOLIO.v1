import styles from './Stats.module.css';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function Stats() {
  const { content } = useI18n();
  const stats = content.stats;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.stats} id="stats">
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.card}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
