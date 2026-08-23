import styles from './Footer.module.css';
import { useI18n } from '../../i18n';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className={styles.footer}>
      <p>© 2026 Bassole Éric Kévin — KevCompilePas. {t.footer.rights}</p>
    </footer>
  );
}
