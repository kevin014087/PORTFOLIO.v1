import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiStar, FiPlusCircle } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa6';
import styles from './Testimonials.module.css';
import { Testimonial } from '../../data/content';
import { AddTestimonialModal } from './AddTestimonialModal';
import { loadUserTestimonials, saveUserTestimonial } from '../../lib/testimonials';
import { useI18n } from '../../i18n';

function renderAccent(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <span key={i} className="accent-italic">{part.slice(1, -1)}</span>;
    }
    return part;
  });
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

export function Testimonials() {
  const { t, content } = useI18n();
  const defaultTestimonials = content.testimonials;
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isMobile = useIsMobile();

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
  }, [defaultTestimonials]);

  const handleAddTestimonial = (newTestimonial: Testimonial) => {
    setAllTestimonials((prev) => [newTestimonial, ...prev]);
    void saveUserTestimonial(newTestimonial);
  };

  const useHorizontalScroll = !isMobile;

  useEffect(() => {
    if (!useHorizontalScroll || !sectionRef.current || !trackRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const setup = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      const scrollAmount = track.scrollWidth - section.offsetWidth;
      if (scrollAmount <= 0) return;

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollAmount}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: () => -scrollAmount,
          ease: 'none',
        }),
      });
    };

    setup();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [useHorizontalScroll, allTestimonials]);

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <FiStar className={styles.badgeIcon} /> {t.testimonials.badge}
        </span>
        <h2 className={styles.title}>{renderAccent(t.testimonials.title)}</h2>
      </div>

      <div ref={sectionRef} className={styles.pinSection}>
        {useHorizontalScroll ? (
          <div ref={trackRef} className={styles.track}>
            {allTestimonials.map((testimonial) => (
              <div key={testimonial.id} className={styles.slide}>
                <div className={styles.card}>
                  <FaQuoteLeft className={styles.quoteIcon} />
                  <div className={styles.starsRow}>
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <FiStar key={i} className={styles.starIcon} />
                    ))}
                  </div>
                  <p className={styles.quoteText}>"{testimonial.content}"</p>
                  <div className={styles.authorRow}>
                    <img src={testimonial.avatar} alt={testimonial.name} className={styles.avatar} loading="lazy" decoding="async" />
                    <div className={styles.authorInfo}>
                      <h4 className={styles.authorName}>{testimonial.name}</h4>
                      <span className={styles.authorRole}>
                        {testimonial.role} • <strong>{testimonial.company}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {allTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  layout
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <div className={styles.card}>
                    <FaQuoteLeft className={styles.quoteIcon} />
                    <div className={styles.starsRow}>
                      {Array.from({ length: testimonial.stars }).map((_, i) => (
                        <FiStar key={i} className={styles.starIcon} />
                      ))}
                    </div>
                    <p className={styles.quoteText}>"{testimonial.content}"</p>
                    <div className={styles.authorRow}>
                      <img src={testimonial.avatar} alt={testimonial.name} className={styles.avatar} loading="lazy" decoding="async" />
                      <div className={styles.authorInfo}>
                        <h4 className={styles.authorName}>{testimonial.name}</h4>
                        <span className={styles.authorRole}>
                          {testimonial.role} • <strong>{testimonial.company}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className={styles.addReviewAction}>
          <button
            type="button"
            className={styles.addReviewBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlusCircle /> {t.testimonials.addReview}
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
