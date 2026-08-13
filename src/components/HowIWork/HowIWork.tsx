import { motion } from 'framer-motion';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import styles from './HowIWork.module.css';
import { workSteps } from '../../data/content';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};

export function HowIWork() {
  return (
    <motion.section
      className={styles.how}
      id="how"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
    >
      <SectionTitle title="Comment je travaille" subtitle="Processus" />
      <div className={styles.grid}>
        {workSteps.map((step) => (
          <motion.article key={step.title} className={styles.card} variants={fadeUpItem}>
            <span className={styles.step}>{step.title}</span>
            <p>{step.description}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
