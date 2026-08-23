import { useState } from 'react';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { Note } from '../../data/content';
import { NoteModal } from './NoteModal';
import { FiArrowRight } from 'react-icons/fi';
import styles from './Notes.module.css';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function Notes() {
  const { t, content } = useI18n();
  const notes = content.notes;
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.notes} id="notes">
      <SectionTitle title={t.notes.title} subtitle={t.notes.subtitle} />
      <div className={styles.grid}>
        {notes.map((note) => (
          <article
            key={note.title}
            className={styles.card}
            onClick={() => setSelectedNote(note)}
            style={{ cursor: 'pointer' }}
          >
            <span className={styles.date}>{note.date}</span>
            <h3>{note.title}</h3>
            <p>{note.excerpt}</p>
            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent, #818cf8)' }}>
              {t.notes.read} <FiArrowRight />
            </div>
          </article>
        ))}
      </div>

      <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </section>
  );
}
