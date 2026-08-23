import { AnimatePresence, motion } from 'framer-motion';
import styles from './Services.module.css';
import { useState } from 'react';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

function renderAccent(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <span key={i} className="accent-italic">{part.slice(1, -1)}</span>;
    }
    return part;
  });
}

const easing = [0.22, 0.61, 0.36, 1];

export function ServicesAccordion() {
  const { t, content } = useI18n();
  const services = content.services;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.services} id="services">
      <div className={styles.header}>
        <p className={styles.subtitle}>{t.services.subtitle}</p>
        <h2 className={styles.title}>{renderAccent(t.services.title)}</h2>
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
      <div className={styles.ctaWrap}>
        <button
          type="button"
          className={styles.ctaBtn}
          onClick={() => window.dispatchEvent(new CustomEvent('portfolio-autopilot', { detail: { action: 'OPEN_CONFIGURATOR' } }))}
        >
          ⚡ {t.commandPalette.cmdConfigurator}
        </button>
      </div>
    </section>
  );
}
