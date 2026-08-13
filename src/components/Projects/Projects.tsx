import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { projects } from '../../data/content';
import type { Project } from '../../data/content';
import styles from './Projects.module.css';

const filterOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'React', value: 'React' },
  { label: 'Flutter', value: 'Flutter' },
  { label: 'Supabase', value: 'Supabase' },
  { label: 'Python', value: 'Python' },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const validFilters = ['all', 'web', 'mobile', 'React', 'Flutter', 'Supabase', 'Python'];

    const handleAutopilot = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      let nextFilter: string | undefined;
      if (typeof detail.filter === 'string' && validFilters.includes(detail.filter)) {
        nextFilter = detail.filter;
      } else if (detail.action === 'FILTER_PROJECTS_MOBILE') {
        nextFilter = 'mobile';
      } else if (detail.action === 'FILTER_PROJECTS_WEB') {
        nextFilter = 'web';
      } else if (detail.action === 'FILTER_PROJECTS_FLUTTER') {
        nextFilter = 'Flutter';
      } else if (detail.action === 'FILTER_PROJECTS_REACT') {
        nextFilter = 'React';
      }

      if (nextFilter) {
        setActiveFilter(nextFilter);
      }

      if (detail.projectId) {
        const found = projects.find((p) => p.id === detail.projectId);
        if (found) setSelectedProject(found);
      }
    };

    window.addEventListener('portfolio-autopilot', handleAutopilot);
    return () => window.removeEventListener('portfolio-autopilot', handleAutopilot);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    if (activeFilter === 'web' || activeFilter === 'mobile') {
      return projects.filter((project) => project.category === activeFilter);
    }
    return projects.filter((project) => project.tags.includes(activeFilter));
  }, [activeFilter]);


  return (
    <section className={styles.projects} id="projects">
      <SectionTitle title="Projets & Réalisations" subtitle="Sélection d'applications Web & Mobiles" />

      <div className={styles.filterRow}>
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={activeFilter === option.value ? styles.activeFilter : ''}
            onClick={() => setActiveFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <motion.div className={styles.grid} layout>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <ProjectCard project={project} onSelect={setSelectedProject} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
