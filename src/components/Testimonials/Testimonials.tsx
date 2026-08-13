import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight, FiPlusCircle } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa6';
import styles from './Testimonials.module.css';
import { testimonials as defaultTestimonials, Testimonial } from '../../data/content';
import { AddTestimonialModal } from './AddTestimonialModal';
import { loadUserTestimonials, saveUserTestimonial } from '../../lib/testimonials';

export function Testimonials() {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadUserTestimonials().then((saved) => {
      if (cancelled) return;
      if (saved.length > 0) {
        setAllTestimonials([...saved, ...defaultTestimonials]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddTestimonial = (newTestimonial: Testimonial) => {
    setAllTestimonials((prev) => [newTestimonial, ...prev]);
    setCurrentIndex(0);
    void saveUserTestimonial(newTestimonial);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const current = allTestimonials[currentIndex] || defaultTestimonials[0];

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <FiStar className={styles.badgeIcon} /> Témoignages & Confiance
          </span>
          <h2 className={styles.title}>Ce que disent mes clients & partenaires</h2>
        </div>

        <div className={styles.sliderWrapper}>
          <button type="button" className={styles.navBtn} onClick={handlePrev} aria-label="Témoignage précédent">
            <FiChevronLeft />
          </button>

          <div className={styles.cardContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className={styles.card}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <FaQuoteLeft className={styles.quoteIcon} />
                <div className={styles.starsRow}>
                  {Array.from({ length: current.stars }).map((_, i) => (
                    <FiStar key={i} className={styles.starIcon} />
                  ))}
                </div>
                <p className={styles.quoteText}>"{current.content}"</p>

                <div className={styles.authorRow}>
                  <img src={current.avatar} alt={current.name} className={styles.avatar} />
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{current.name}</h4>
                    <span className={styles.authorRole}>
                      {current.role} • <strong>{current.company}</strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button type="button" className={styles.navBtn} onClick={handleNext} aria-label="Témoignage suivant">
            <FiChevronRight />
          </button>
        </div>

        <div className={styles.dotsRow}>
          {allTestimonials.map((t, index) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>

        <div className={styles.addReviewAction}>
          <button
            type="button"
            className={styles.addReviewBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlusCircle /> Laisser un avis / témoignage
          </button>
        </div>
      </div>

      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTestimonial={handleAddTestimonial}
      />
    </section>
  );
}

