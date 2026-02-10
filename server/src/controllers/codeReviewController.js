const github = require('../services/github');
const { analyzeCode, reviewPRDiff } = require('../engine/ai/analyzer');
const Issue = require('../models/Issue');
const Scan = require('../models/Scan');

/**
 * List GitHub repos accessible via PAT.
 */
exports.listGithubRepos = async (req, res) => {
  try {
    const repos = await github.listRepos(req.query.page || 1);
    res.json(repos.map(r => ({
      id: r.id,
      name: r.full_name,
      url: r.html_url,
      language: r.language,
      private: r.private,
      updatedAt: r.updated_at,
      defaultBranch: r.default_branch,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * List open PRs for a repo.
 */
exports.listPRs = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const prs = await github.listPRs(owner, repo);
    res.json(prs.map(pr => ({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      author: pr.user?.login,
      createdAt: pr.created_at,
      url: pr.html_url,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changed_files,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Security review a PR with Gemini AI.
 */
exports.reviewPR = async (req, res) => {
  try {
    const { owner, repo, prNumber } = req.params;

    // Get the PR diff
    const diff = await github.getPRDiff(owner, repo, prNumber);
    if (!diff) return res.status(404).json({ message: 'PR diff not found' });

    // Analyze with Gemini
    const findings = await reviewPRDiff(diff, `${owner}/${repo}`);

    // Create issues for any findings
    for (const f of findings) {
      await Issue.create({
        userId: req.user.id,
        title: `[PR #${prNumber}] ${f.title}`,
        severity: f.severity || 'medium',
        status: 'open',
        description: f.description,
        location: `${f.file}:${f.line || '?'}`,
        remediation: f.fix,
        category: 'pr-review',
        source: 'pr-review',
      });
    }

    // Optionally post review on GitHub
    if (findings.length > 0 && req.body.postComment) {
      const body = `## 🛡️ SentinelOps Security Review\n\n` +
        `Found **${findings.length}** security issue(s):\n\n` +
        findings.map(f => `- **[${f.severity?.toUpperCase()}]** ${f.title} — ${f.file}:${f.line || '?'}\n  ${f.description}`).join('\n\n');
      await github.postPRReview(owner, repo, prNumber, body);
    }

    res.json({ findings, totalIssues: findings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Full white-box source code scan of a GitHub repo.
 */
exports.scanRepo = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { branch } = req.query;

    // Create a scan record
    const scan = await Scan.create({
      userId: req.user.id,
      name: `Code Review — ${owner}/${repo}`,
      scanType: 'white-box',
      targets: [{ type: 'repository', value: `https://github.com/${owner}/${repo}` }],
      status: 'running',
      startedAt: new Date(),
    });

    res.status(201).json(scan);

    // Run code review in background
    runCodeReview(scan._id, req.user.id, owner, repo, branch).catch(err => {
      console.error('Code review failed:', err);
      Scan.findByIdAndUpdate(scan._id, { status: 'failed' }).catch(() => {});
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Background code review ──
async function runCodeReview(scanId, userId, owner, repo, branch) {
  try {
    await Scan.findByIdAndUpdate(scanId, {
      progress: 10,
      $push: { logs: { phase: 'fetch', message: `Fetching source code from ${owner}/${repo}...` } },
    });

    // Get source files
    const files = await github.getSourceFiles(owner, repo, branch || 'main');

    await Scan.findByIdAndUpdate(scanId, {
      progress: 30,
      $push: { logs: { phase: 'fetch', message: `Fetched ${files.length} source files for review` } },
    });

    // Analyze each file with Gemini
    const allFindings = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = 30 + Math.round((i / files.length) * 60);

      await Scan.findByIdAndUpdate(scanId, {
        progress,
        $push: { logs: { phase: 'review', message: `Reviewing ${file.path}...` } },
      });

      const findings = await analyzeCode(file.content, file.language, file.path);
      allFindings.push(...findings);

      // Small delay to avoid rate limiting
      if (i < files.length - 1) await new Promise(r => setTimeout(r, 1000));
    }

    // Create issues
    for (const f of allFindings) {
      await Issue.create({
        userId,
        scanId,
        title: f.title,
        severity: f.severity,
        status: 'open',
        description: f.description,
        location: f.location,
        evidence: f.evidence,
        remediation: f.remediation,
        cwe: f.cwe,
        owasp: f.owasp,
        category: 'code-review',
        source: 'code-review',
      });
    }

    // Finalize scan
    const duration = Math.round((Date.now() - (await Scan.findById(scanId)).startedAt.getTime()) / 1000);
    await Scan.findByIdAndUpdate(scanId, {
      status: 'completed',
      completedAt: new Date(),
      progress: 100,
      duration,
      findings: allFindings.map(f => ({ ...f, foundAt: new Date() })),
      toolsUsed: [{ name: 'gemini-ai', version: '2.5-flash' }, { name: 'github-api', version: 'v3' }],
      $push: { logs: { phase: 'done', message: `Code review complete. ${allFindings.length} issues found.` } },
    });
  } catch (err) {
    await Scan.findByIdAndUpdate(scanId, { status: 'failed' });
    throw err;
  }
}
