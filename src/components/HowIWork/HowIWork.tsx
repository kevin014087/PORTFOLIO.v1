import { SectionTitle } from '../SectionTitle/SectionTitle';
import styles from './HowIWork.module.css';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function HowIWork() {
  const { t, content } = useI18n();
  const workSteps = content.workSteps;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.how} id="how">
      <SectionTitle title={t.how.title} subtitle={t.how.subtitle} />
      <div className={styles.grid}>
        {workSteps.map((step) => (
          <article key={step.title} className={styles.card}>
            <span className={styles.step}>{step.title}</span>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
