import { useState } from 'react';
import { FiStar, FiGitBranch, FiGithub, FiRefreshCw, FiCheck } from 'react-icons/fi';
import styles from './GithubActivity.module.css';
import { useGithubRepos } from '../../hooks/useGithubRepos';
import { GITHUB_USERNAME } from '../../lib/github';
import { useI18n } from '../../i18n';

function timeAgo(date: string, lang: 'fr' | 'en'): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

  if (days >= 30) return rtf.format(-Math.floor(days / 30), 'month');
  if (days >= 7) return rtf.format(-Math.floor(days / 7), 'week');
  if (days >= 1) return rtf.format(-days, 'day');
  if (hours >= 1) return rtf.format(-hours, 'hour');
  return rtf.format(-Math.max(minutes, 1), 'minute');
}

export function GithubActivity() {
  const { t, lang } = useI18n();
  const { repos, loading, error, refresh } = useGithubRepos();
  const [refreshed, setRefreshed] = useState(false);

  const handleRefresh = () => {
    refresh();
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 2500);
  };

  return (
    <section id="github" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>
              <FiGithub /> {t.github.badge}
            </span>
            <button type="button" className={styles.refreshBtn} onClick={handleRefresh} aria-label={t.github.refresh} title={t.github.refresh}>
              {refreshed ? <FiCheck /> : <FiRefreshCw />}
            </button>
          </div>
          <h2 className={styles.title}>
            {t.github.title} <span className={styles.liveTag}>{t.github.live}</span>
          </h2>
          <p className={styles.subtitle}>{t.github.subtitle}</p>
        </div>

        <div className={styles.profileRow}>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <FiGithub /> {GITHUB_USERNAME}
          </a>
        </div>

        {loading ? (
          <div className={styles.stateBox}>
            <span className={styles.spinner} />
            <p>{t.github.loading}</p>
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <p>{t.github.error}</p>
            <button type="button" className={styles.retryBtn} onClick={handleRefresh}>
              {t.github.refresh}
            </button>
          </div>
        ) : repos.length === 0 ? (
          <div className={styles.stateBox}>
            <p>{t.github.empty}</p>
          </div>
        ) : (
          <div className={styles.repoGrid}>
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoCard}
              >
                <div className={styles.repoHeader}>
                  <h3>{repo.name}</h3>
                  {repo.language && <span className={styles.langPill}>{repo.language}</span>}
                </div>
                <p className={styles.repoDesc}>
                  {repo.description || t.github.empty}
                </p>
                <div className={styles.repoMeta}>
                  <span className={styles.metaItem}>
                    <FiStar /> {repo.stars} {t.github.stars}
                  </span>
                  <span className={styles.metaItem}>
                    <FiGitBranch /> {repo.forks} {t.github.forks}
                  </span>
                  <span className={styles.metaItem}>
                    {t.github.updated} {timeAgo(repo.updatedAt, lang)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
