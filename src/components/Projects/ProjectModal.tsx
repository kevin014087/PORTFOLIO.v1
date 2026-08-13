import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiGithub, FiCheck, FiActivity, FiMessageSquare } from 'react-icons/fi';
import styles from './Projects.module.css';
import type { Project } from '../../data/content';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(Boolean(project), dialogRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const handleLeaveReview = () => {
    onClose();
    setTimeout(() => {
      const testimonialsSection = document.querySelector('#testimonials');
      testimonialsSection?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay} onClick={onClose} role="presentation">
        <motion.div
          ref={dialogRef}
          className={styles.modalContent}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.modalHeader} style={{ background: project.gradient }}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={onClose}
              aria-label="Fermer la vue détaillée du projet"
            >
              <FiX />
            </button>
            <span className={styles.modalCategory}>{project.category.toUpperCase()}</span>
            <h2 id="project-modal-title" className={styles.modalTitle}>{project.title}</h2>
          </div>

          <div className={styles.modalBody}>
            {project.description && (
              <div className={styles.modalSection}>
                <h3>Aperçu du Projet</h3>
                <p>{project.description}</p>
              </div>
            )}

            {project.metrics && (
              <div className={styles.metricBadge}>
                <FiActivity />
                <span>Résultat & Performance : <strong>{project.metrics}</strong></span>
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <div className={styles.modalSection}>
                <h3>Points Forts Techniques</h3>
                <ul className={styles.highlightsList}>
                  {project.highlights.map((item, idx) => (
                    <li key={idx}>
                      <FiCheck className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.modalSection}>
              <h3>Technologies Utilisées</h3>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.modalTag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>
                <FiExternalLink /> Démo en direct / Contact
              </a>
              <button type="button" onClick={handleLeaveReview} className={styles.secondaryLink}>
                <FiMessageSquare /> Laisser un avis
              </button>
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>
                <FiGithub /> Code Source
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

