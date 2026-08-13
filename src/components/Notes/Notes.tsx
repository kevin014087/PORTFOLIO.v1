import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { notes, Note } from '../../data/content';
import { NoteModal } from './NoteModal';
import { FiArrowRight } from 'react-icons/fi';
import styles from './Notes.module.css';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};

export function Notes() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <motion.section className={styles.notes} id="notes" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>
      <SectionTitle title="Notes" subtitle="Articles & Retours d'expérience" />
      <div className={styles.grid}>
        {notes.map((note) => (
          <motion.article
            key={note.title}
            className={styles.card}
            variants={fadeUpItem}
            onClick={() => setSelectedNote(note)}
            style={{ cursor: 'pointer' }}
          >
            <span className={styles.date}>{note.date}</span>
            <h3>{note.title}</h3>
            <p>{note.excerpt}</p>
            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent, #818cf8)' }}>
              Lire l'article <FiArrowRight />
            </div>
          </motion.article>
        ))}
      </div>

      <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </motion.section>
  );
}

