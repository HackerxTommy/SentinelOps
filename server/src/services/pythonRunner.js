/**
 * Runs Python analyzer scripts and returns parsed JSON output.
 * Reads ONLY stdout for JSON; logs go to stderr.
 */
const { spawn } = require('child_process');
const path = require('path');

const SCRIPTS_DIR = path.resolve(__dirname, '..', '..', '..', 'python-analyzers');
const TIMEOUT = 5 * 60 * 1000; // 5 min

/**
 * @param {string} scriptName - e.g. 'code_scanner.py'
 * @param {string[]} args - CLI arguments
 * @returns {Promise<object>} parsed JSON from stdout
 */
function runPython(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const proc = spawn(pythonCmd, [scriptPath, ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      try { proc.kill(); } catch {}
      reject(new Error('Python script timed out'));
    }, TIMEOUT);

    proc.on('close', code => {
      clearTimeout(timer);
      if (stderr) console.log(`[pythonRunner] stderr: ${stderr.slice(0, 500)}`);
      if (code !== 0) {
        return reject(new Error(`Script exited with code ${code}: ${stderr.slice(-300)}`));
      }
      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch {
        reject(new Error(`Invalid JSON from script: ${stdout.slice(0, 300)}`));
      }
    });

    proc.on('error', err => {
      clearTimeout(timer);
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });
  });
}

module.exports = { runPython };
