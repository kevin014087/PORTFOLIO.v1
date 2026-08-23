import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiSend, FiCheckCircle } from 'react-icons/fi';
import styles from './AddTestimonialModal.module.css';
import { onSubmit } from '../../lib/contact';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useI18n, tpl } from '../../i18n';

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectTitle?: string;
  onAddTestimonial: (newTestimonial: {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    stars: number;
    avatar: string;
  }) => void;
}

export function AddTestimonialModal({
  isOpen,
  onClose,
  initialProjectTitle = '',
  onAddTestimonial,
}: AddTestimonialModalProps) {
  const { t, content } = useI18n();
  const projects = content.projects;
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedProject, setSelectedProject] = useState(initialProjectTitle || 'Global');
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [content_, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, dialogRef);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content_.trim()) return;

    setStatus('submitting');
    setErrorMessage('');

    const companyLabel = selectedProject && selectedProject !== 'Global' ? selectedProject : 'Portfolio KevCompilePas';
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const newReview = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      role: role.trim() || t.addReview.defaultRole,
      company: companyLabel,
      content: content_.trim(),
      stars,
      avatar: avatarUrl,
    };

    const emailMessage = `
${t.addReview.emailTitle}

👤 Nom : ${name}
💼 ${t.addReview.emailRole} : ${role || t.addReview.emailNotSpecified}
📌 ${t.addReview.emailProject} : ${companyLabel}
⭐ ${t.addReview.emailStars} : ${stars}/5
💬 :
"${content_}"
    `;

    const res = await onSubmit({
      name,
      email: 'avis-visiteur@portfolio.com',
      message: emailMessage,
    });

    if (res.success) {
      onAddTestimonial(newReview);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
        setName('');
        setRole('');
        setContent('');
        setStars(5);
      }, 2000);
    } else {
      onAddTestimonial(newReview);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose} role="presentation">
        <motion.div
          ref={dialogRef}
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-testimonial-title"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2 id="add-testimonial-title" className={styles.title}>
              {t.addReview.title}
            </h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.addReview.closeAria}>
              <FiX />
            </button>
          </div>

          {status === 'success' ? (
            <div className={styles.successState}>
              <FiCheckCircle className={styles.successIcon} />
              <h3>{t.addReview.successTitle}</h3>
              <p>{t.addReview.successText}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="rev-name">{t.addReview.nameLabel}</label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    placeholder={t.addReview.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="rev-role">{t.addReview.roleLabel}</label>
                  <input
                    id="rev-role"
                    type="text"
                    placeholder={t.addReview.rolePlaceholder}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="rev-project">{t.addReview.projectLabel}</label>
                <select
                  id="rev-project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="Global">{t.addReview.projectGeneral}</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      🚀 {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>{t.addReview.starsLabel}</label>
                <div className={styles.starsPicker}>
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const active = starVal <= (hoverStars || stars);
                    return (
                      <button
                        key={starVal}
                        type="button"
                        className={`${styles.starBtn} ${active ? styles.starActive : ''}`}
                        onClick={() => setStars(starVal)}
                        onMouseEnter={() => setHoverStars(starVal)}
                        onMouseLeave={() => setHoverStars(0)}
                        aria-label={tpl(t.addReview.starsAria, { value: starVal })}
                      >
                        <FiStar className={styles.starIcon} />
                      </button>
                    );
                  })}
                  <span className={styles.starsRatingText}>{stars} {t.addReview.starsSuffix}</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="rev-content">{t.addReview.contentLabel}</label>
                <textarea
                  id="rev-content"
                  required
                  rows={4}
                  placeholder={t.addReview.contentPlaceholder}
                  value={content_}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {errorMessage && <p className={styles.error}>{errorMessage}</p>}

              <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                <FiSend />
                <span>{status === 'submitting' ? t.addReview.submitting : t.addReview.submit}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
