import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiBookOpen } from 'react-icons/fi';
import styles from './NoteModal.module.css';
import type { Note } from '../../data/content';
import { renderMarkdown } from '../../lib/markdown';
import { useI18n } from '../../i18n';

interface NoteModalProps {
  note: Note | null;
  onClose: () => void;
}

export function NoteModal({ note, onClose }: NoteModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (note) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note, onClose]);

  useEffect(() => {
    if (!note) return;

    const previousTitle = document.title;
    document.title = `${note.title} — KevCompilePas`;

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') ?? '';
    if (metaDescription) {
      metaDescription.setAttribute('content', note.excerpt);
    }

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, [note]);

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
                <FiBookOpen /> {t.noteModal.badge}
              </span>
              <span className={styles.date}>
                <FiCalendar /> {note.date}
              </span>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.noteModal.closeAria}>
              <FiX />
            </button>
          </div>

          <h2 id="note-modal-title" className={styles.title}>
            {note.title}
          </h2>

          <div className={styles.body}>
            {note.content ? (
              <div className={styles.articleContent}>
                {renderMarkdown(note.content)}
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
