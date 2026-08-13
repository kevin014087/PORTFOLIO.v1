import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiMail, FiPhone, FiCheckCircle, FiBriefcase, FiAward, FiCode, FiPrinter } from 'react-icons/fi';

import styles from './CvModal.module.css';
import { cvData } from '../../data/content';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CvModal({ isOpen, onClose }: CvModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, dialogRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} role="presentation">
          <motion.div
            ref={dialogRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-modal-title"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <FiAward className={styles.headerIcon} />
                <h2 id="cv-modal-title">Curriculum Vitae</h2>
              </div>
              <div className={styles.headerActions}>
                <a
                  href="/CV_Bassole_Kevin.pdf"
                  download="CV_Bassole_Kevin.pdf"
                  className={styles.downloadBtn}
                  aria-label="Télécharger le CV au format PDF"
                >
                  <FiDownload />
                  <span>Télécharger PDF</span>
                </a>
                <button
                  type="button"
                  className={styles.downloadBtn}
                  onClick={() => window.print()}
                  aria-label="Imprimer le CV"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <FiPrinter />
                  <span>Imprimer</span>
                </button>
                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fermer la modale CV">
                  <FiX />
                </button>
              </div>
            </div>


            <div className={styles.content}>
              {/* Profile Header */}
              <div className={styles.profileSection}>
                <h1 className={styles.name}>{cvData.name}</h1>
                <p className={styles.title}>{cvData.title}</p>
                <div className={styles.contactRow}>
                  <span><FiMail /> {cvData.email}</span>
                  <span><FiPhone /> {cvData.phone}</span>
                </div>
                <p className={styles.summary}>{cvData.summary}</p>
              </div>

              {/* Skills Grid */}
              <div className={styles.section}>
                <h3><FiCode /> Compétences Clés</h3>
                <div className={styles.skillsTags}>
                  {cvData.skills.map((skill) => (
                    <span key={skill} className={styles.skillTag}>
                      <FiCheckCircle /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Timeline */}
              <div className={styles.section}>
                <h3><FiBriefcase /> Expériences Professionnelles</h3>
                <div className={styles.experiencesList}>
                  {cvData.experiences.map((exp, i) => (
                    <div key={i} className={styles.expCard}>
                      <div className={styles.expTop}>
                        <h4 className={styles.expRole}>{exp.role}</h4>
                        <span className={styles.expPeriod}>{exp.period}</span>
                      </div>
                      <div className={styles.expCompany}>{exp.company}</div>
                      <p className={styles.expDesc}>{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className={styles.section}>
                <h3>🎓 Formation</h3>
                <p className={styles.education}>{cvData.education}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
