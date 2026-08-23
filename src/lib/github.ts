export const GITHUB_USERNAME = 'kevcompilepas';

export interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
}

const CACHE_KEY = 'portfolio-github-repos';
const CACHE_TTL_MS = 30 * 60 * 1000;

function readCache(): GithubRepo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { fetchedAt: number; repos: GithubRepo[] };
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return Array.isArray(parsed.repos) ? parsed.repos : null;
  } catch {
    return null;
  }
}

function writeCache(repos: GithubRepo[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), repos }));
  } catch {
    // storage unavailable: ignore
  }
}

let inFlight: Promise<GithubRepo[]> | null = null;

export async function fetchGitHubRepos(force = false): Promise<GithubRepo[]> {
  if (!force) {
    const cached = readCache();
    if (cached) return cached;
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json' } },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}`);
    }

    const data = (await response.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      updated_at: string;
    }>;

    const repos: GithubRepo[] = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));

    writeCache(repos);
    return repos;
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
}
