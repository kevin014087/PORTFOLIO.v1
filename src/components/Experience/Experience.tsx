import { SectionTitle } from '../SectionTitle/SectionTitle';
import styles from './Experience.module.css';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function Experience() {
  const { t, content } = useI18n();
  const experiences = content.experiences;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.experience} id="experience">
      <SectionTitle title={t.experience.title} subtitle={t.experience.subtitle} />
      <p className={styles.summary}>{t.experience.summary}</p>
      <div className={styles.timeline}>
        {experiences.map((item) => (
          <article key={item.company} className={styles.entry}>
            <span className={styles.period}>{item.period}</span>
            <div>
              <h3>{item.role}</h3>
              <p>{item.company}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
