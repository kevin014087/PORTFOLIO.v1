import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaPython,
  FaDatabase,
} from 'react-icons/fa6';
import { SiNextdotjs, SiFlutter, SiSupabase, SiJavascript } from 'react-icons/si';
import { IconType } from 'react-icons';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import styles from './About.module.css';
import { useI18n } from '../../i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const skillIconMap: Record<string, IconType> = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JavaScript: SiJavascript,
  React: FaReact,
  'Next.js': SiNextdotjs,
  Flutter: SiFlutter,
  Python: FaPython,
  SQL: FaDatabase,
  Supabase: SiSupabase,
};

const skillColorMap: Record<string, string> = {
  HTML: '#e34c26',
  CSS: '#1572b6',
  JavaScript: '#f7df1e',
  React: '#61dafb',
  'Next.js': '#111111',
  Flutter: '#54c7f9',
  Python: '#3776ab',
  SQL: '#4479a1',
  Supabase: '#3ecf8e',
};

export function About() {
  const { t, content } = useI18n();
  const skills = content.skills;
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className={styles.about} id="about">
      <SectionTitle title={t.about.title} subtitle={t.about.subtitle} />
      <div className={styles.content}>
        <p>{t.about.text}</p>
        <div className={styles.skillsOrbitWrap}>
          <div className={styles.skillsOrbit} aria-label={t.about.orbitAria}>
            <div className={styles.orbitCore}>
              <span>{t.about.stack}</span>
              <small>{t.about.dev}</small>
            </div>
            <div className={styles.orbitTrack}>
              {skills.map((skill, index) => {
                const Icon = skillIconMap[skill.name];
                return (
                  <span
                    key={skill.name}
                    className={styles.orbitItem}
                    style={{ '--i': index, '--icon-color': skillColorMap[skill.name] } as React.CSSProperties}
                    aria-label={skill.name}
                  >
                    {Icon ? <Icon /> : null}
                    <em>{skill.label}</em>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
