import { motion } from 'framer-motion';
import { FiInfo, FiExternalLink } from 'react-icons/fi';
import styles from './Projects.module.css';
import type { Project } from '../../data/content';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const cardHover = {
  hover: {
    y: -6,
    boxShadow: '0 24px 40px -20px rgba(0,0,0,0.3)',
  },
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <motion.article
      className={styles.projectCard}
      variants={cardHover}
      whileHover="hover"
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      layout
      tabIndex={0}
      role="button"
      aria-label={`Voir les détails du projet : ${project.title}`}
      onClick={() => onSelect(project)}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.visual} style={{ background: project.gradient }}>
        <div className={styles.mockupHeader}>
          <span className={`${styles.mockupDot} ${styles.dotRed}`} />
          <span className={`${styles.mockupDot} ${styles.dotYellow}`} />
          <span className={`${styles.mockupDot} ${styles.dotGreen}`} />
          <span className={styles.mockupTitle}>{project.category === 'mobile' ? '📱 App Mobile iOS/Android' : '🌐 Application Web / SaaS'}</span>
        </div>
        <motion.div
          className={styles.hoverIcon}
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <FiInfo />
        </motion.div>
      </div>
      <div className={styles.meta}>
        <span className={styles.category}>{project.category.toUpperCase()}</span>
        <h3>{project.title}</h3>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.links}>
          <button
            type="button"
            className={styles.detailBtn}
            aria-label={`Voir l'architecture du projet ${project.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
          >
            <FiInfo /> Détails & Architecture
          </button>
          <a
            href={project.liveUrl}
            aria-label={`Visiter le projet ${project.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <FiExternalLink />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

