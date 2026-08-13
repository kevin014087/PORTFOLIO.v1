import { motion } from 'framer-motion';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import styles from './Experience.module.css';
import { experiences } from '../../data/content';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};

export function Experience() {
  return (
    <motion.section className={styles.experience} id="experience" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={container}>
      <SectionTitle title="Expérience" subtitle="Parcours" />
      <p className={styles.summary}>4+ ans d'expérience</p>
      <div className={styles.timeline}>
        {experiences.map((item) => (
          <motion.article key={item.company} className={styles.entry} variants={fadeUpItem}>
            <span className={styles.period}>{item.period}</span>
            <div>
              <h3>{item.role}</h3>
              <p>{item.company}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
