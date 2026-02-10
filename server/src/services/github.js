/**
 * GitHub Integration Service
 * Uses Personal Access Token for repository access, PR review, and code fetching.
 */

const GITHUB_API = 'https://api.github.com';

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not configured');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SentinelOps-Security-Platform',
  };
}

/**
 * List repositories accessible to the authenticated user.
 */
async function listRepos(page = 1, perPage = 30) {
  const res = await fetch(`${GITHUB_API}/user/repos?page=${page}&per_page=${perPage}&sort=updated`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

/**
 * Get repository details.
 */
async function getRepo(owner, repo) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Repo not found: ${owner}/${repo}`);
  return res.json();
}

/**
 * List open pull requests for a repository.
 */
async function listPRs(owner, repo, state = 'open') {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls?state=${state}&per_page=20`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to list PRs: ${res.status}`);
  return res.json();
}

/**
 * Get PR diff for security review.
 */
async function getPRDiff(owner, repo, prNumber) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`, {
    headers: {
      ...getHeaders(),
      'Accept': 'application/vnd.github.v3.diff',
    },
  });
  if (!res.ok) throw new Error(`Failed to get PR diff: ${res.status}`);
  return res.text();
}

/**
 * Get file contents from a repository.
 */
async function getFileContent(owner, repo, filePath, ref = 'main') {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}?ref=${ref}`, {
    headers: getHeaders(),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  return data.content;
}

/**
 * List files in a repository directory (recursive tree).
 */
async function getRepoTree(owner, repo, ref = 'main') {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to get repo tree: ${res.status}`);
  const data = await res.json();
  return (data.tree || []).filter(t => t.type === 'blob');
}

/**
 * Post a review comment on a PR (for automated security review).
 */
async function postPRReview(owner, repo, prNumber, body, event = 'COMMENT') {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    method: 'POST',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, event }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to post PR review: ${err.message}`);
  }
  return res.json();
}

/**
 * Get source code files for security scanning.
 * Returns array of { path, content, language }
 */
async function getSourceFiles(owner, repo, ref = 'main', extensions = ['.js', '.ts', '.py', '.java', '.go', '.php', '.rb']) {
  const tree = await getRepoTree(owner, repo, ref);

  // Filter to code files only (skip node_modules, vendor, etc.)
  const codeFiles = tree.filter(f => {
    const ext = '.' + f.path.split('.').pop();
    if (!extensions.includes(ext)) return false;
    if (f.path.includes('node_modules/')) return false;
    if (f.path.includes('vendor/')) return false;
    if (f.path.includes('.min.')) return false;
    if (f.path.includes('dist/')) return false;
    if (f.size > 100000) return false; // skip files > 100KB
    return true;
  });

  // Fetch content for each file (limit to 50 files for performance)
  const files = [];
  for (const f of codeFiles.slice(0, 50)) {
    try {
      const content = await getFileContent(owner, repo, f.path, ref);
      if (content) {
        const ext = f.path.split('.').pop();
        files.push({ path: f.path, content, language: ext, size: f.size });
      }
    } catch { /* skip unreadable files */ }
  }

  return files;
}

module.exports = {
  listRepos,
  getRepo,
  listPRs,
  getPRDiff,
  getFileContent,
  getRepoTree,
  postPRReview,
  getSourceFiles,
};
