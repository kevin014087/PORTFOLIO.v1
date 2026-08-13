import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiSend, FiCheckCircle } from 'react-icons/fi';
import styles from './AddTestimonialModal.module.css';
import { projects } from '../../data/content';
import { onSubmit } from '../../lib/contact';
import { useFocusTrap } from '../../hooks/useFocusTrap';

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
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [selectedProject, setSelectedProject] = useState(initialProjectTitle || 'Global');
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, dialogRef);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setStatus('submitting');
    setErrorMessage('');

    const companyLabel = selectedProject && selectedProject !== 'Global' ? selectedProject : 'Portfolio KevCompilePas';
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const newReview = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      role: role.trim() || 'Client / Visiteur',
      company: companyLabel,
      content: content.trim(),
      stars,
      avatar: avatarUrl,
    };

    // Send to Web3Forms / Email notification
    const emailMessage = `
Nouveau Témoignage Réceptionné sur le Portfolio !

👤 Nom : ${name}
💼 Rôle / Titre : ${role || 'Non spécifié'}
📌 Projet concerné : ${companyLabel}
⭐ Note : ${stars}/5 étoiles
💬 Avis :
"${content}"
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
      // Even if email fails, we still publish locally
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
              💬 Laisser un avis / témoignage
            </h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
              <FiX />
            </button>
          </div>

          {status === 'success' ? (
            <div className={styles.successState}>
              <FiCheckCircle className={styles.successIcon} />
              <h3>Merci beaucoup pour votre avis !</h3>
              <p>Votre avis a été transmis à Kevin et ajouté à l'aperçu de votre navigateur.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="rev-name">Votre Nom & Prénom *</label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    placeholder="Ex: Jean-Luc Mensah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="rev-role">Rôle / Post (Optionnel)</label>
                  <input
                    id="rev-role"
                    type="text"
                    placeholder="Ex: Client / Product Owner"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="rev-project">Projet concerné</label>
                <select
                  id="rev-project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="Global">⭐ Avis Général sur le Portfolio</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      🚀 {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Note attribuée</label>
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
                        aria-label={`Donner une note de ${starVal} sur 5`}
                      >
                        <FiStar className={styles.starIcon} />
                      </button>
                    );
                  })}
                  <span className={styles.starsRatingText}>{stars} / 5 étoiles</span>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="rev-content">Votre Avis / Retour d'expérience *</label>
                <textarea
                  id="rev-content"
                  required
                  rows={4}
                  placeholder="Partagez votre avis sur la qualité du travail, la réactivité, le design ou l'expérience globale..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {errorMessage && <p className={styles.error}>{errorMessage}</p>}

              <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                <FiSend />
                <span>{status === 'submitting' ? 'Envoi de votre avis...' : 'Envoyer mon avis'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
