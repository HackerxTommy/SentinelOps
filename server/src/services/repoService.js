/**
 * Service to clone GitHub repos into temp directories.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const CLONE_BASE = path.join(os.tmpdir(), 'sentinelops-repo-scans');

/**
 * Clone a GitHub repo and return the local path.
 * @param {string} repoUrl - e.g. https://github.com/user/repo
 * @param {string} [token] - optional GitHub PAT
 * @returns {string} local path to cloned repo
 */
function cloneRepo(repoUrl, token) {
  if (!fs.existsSync(CLONE_BASE)) fs.mkdirSync(CLONE_BASE, { recursive: true });

  // Derive a directory name from the URL
  const parts = repoUrl.replace(/\.git$/, '').split('/');
  const repoName = parts.pop() || 'repo';
  const owner = parts.pop() || 'unknown';
  const dirname = `${owner}_${repoName}_${Date.now()}`;
  const destPath = path.join(CLONE_BASE, dirname);

  // If a token is provided, inject it into the URL for private repos
  let cloneUrl = repoUrl;
  if (token && repoUrl.startsWith('https://')) {
    cloneUrl = repoUrl.replace('https://', `https://${token}@`);
  }

  console.log(`[repoService] Cloning ${repoUrl} → ${destPath}`);
  execSync(`git clone --depth 1 ${cloneUrl} "${destPath}"`, {
    stdio: 'pipe',
    timeout: 120000,
  });

  return destPath;
}

/**
 * Clean up a cloned repo after scanning.
 */
function cleanupRepo(repoPath) {
  try {
    fs.rmSync(repoPath, { recursive: true, force: true });
  } catch {}
}

module.exports = { cloneRepo, cleanupRepo };
