import { AnimatePresence, motion } from 'framer-motion';
import { services } from '../../data/content';
import styles from './Services.module.css';
import { useState } from 'react';

const easing = [0.22, 0.61, 0.36, 1];

export function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.section
      className={styles.services}
      id="services"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: easing }}
    >
      <div className={styles.header}>
        <p className={styles.subtitle}>Services</p>
        <h2 className={styles.title}>Ce que je propose</h2>
      </div>
      <div className={styles.list}>
        {services.map((service, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={service.title} className={styles.item}>
              <button type="button" className={styles.trigger} onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}>
                <span>
                  <strong>{service.title}</strong>
                  <span>{service.summary}</span>
                </span>
                <motion.span className={styles.icon} animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.35, ease: easing }}>
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className={styles.panel}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: easing }}
                  >
                    <p>{service.details}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}
