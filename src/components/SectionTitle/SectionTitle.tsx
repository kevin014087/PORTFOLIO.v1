import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  title: string;
  subtitle: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.subtitle}>{subtitle}</p>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
