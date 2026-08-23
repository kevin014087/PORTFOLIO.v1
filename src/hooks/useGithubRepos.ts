import { useCallback, useEffect, useState } from 'react';
import { fetchGitHubRepos, type GithubRepo } from '../lib/github';

interface GithubReposState {
  repos: GithubRepo[];
  loading: boolean;
  error: boolean;
  refresh: () => void;
}

export function useGithubRepos(): GithubReposState {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback((force = false) => {
    setLoading(true);
    setError(false);
    fetchGitHubRepos(force)
      .then((data) => setRepos(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  return { repos, loading, error, refresh };
}
