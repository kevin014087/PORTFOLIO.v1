import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  title: string;
  subtitle: string;
}

function renderTitle(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={i} className="accent-italic">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.subtitle}>{subtitle}</p>
      <h2 className={styles.title}>{renderTitle(title)}</h2>
    </div>
  );
}
