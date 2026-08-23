import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { projects } from '../../data/content';
import type { Project } from '../../data/content';
import styles from './Projects.module.css';

const CARD_WIDTH = 380;
const CARD_GAP = 24;

const filterOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'React', value: 'React' },
  { label: 'Flutter', value: 'Flutter' },
  { label: 'Supabase', value: 'Supabase' },
  { label: 'Python', value: 'Python' },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isMobile = useIsMobile();

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

  const useHorizontalScroll = !isMobile;

  useLayoutEffect(() => {
    if (!useHorizontalScroll || !sectionRef.current || !trackRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const refreshAndCreate = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }

      const scrollAmount = track.scrollWidth - section.offsetWidth;

      if (scrollAmount <= 0) return;

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollAmount}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: () => -scrollAmount,
          ease: 'none',
        }),
      });
    };

    refreshAndCreate();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [useHorizontalScroll, filteredProjects]);

  return (
    <section className={styles.projects} id="projects">
      <SectionTitle title="Projets & Réalisations" subtitle="Sélection d'applications Web & Mobiles" />

      <div ref={sectionRef} className={styles.pinSection}>
        <div className={styles.filtersBar}>
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
        </div>

        {useHorizontalScroll ? (
          <div ref={trackRef} className={styles.track}>
            {filteredProjects.map((project) => (
              <div key={project.id} className={styles.slide}>
                <ProjectCard project={project} onSelect={setSelectedProject} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <ProjectCard project={project} onSelect={setSelectedProject} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
