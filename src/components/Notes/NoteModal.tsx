import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiBookOpen } from 'react-icons/fi';
import styles from './NoteModal.module.css';
import type { Note } from '../../data/content';

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
}

export function NoteModal({ note, onClose }: NoteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (note) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note, onClose]);

  if (!note) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose} role="presentation">
        <motion.div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-modal-title"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.headerMeta}>
              <span className={styles.badge}>
                <FiBookOpen /> Article / Note
              </span>
              <span className={styles.date}>
                <FiCalendar /> {note.date}
              </span>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fermer l'article">
              <FiX />
            </button>
          </div>

          <h2 id="note-modal-title" className={styles.title}>
            {note.title}
          </h2>

          <div className={styles.body}>
            {note.content ? (
              <div className={styles.articleContent}>
                {note.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={idx}>{paragraph.replace('### ', '')}</h3>;
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            ) : (
              <p>{note.excerpt}</p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
