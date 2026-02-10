const { spawn } = require('child_process');

exports.runPythonScript = (scriptPath, argsArray) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath, ...argsArray]);
    let outputData = '';
    let errorData = '';

    const timeout = setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Python script execution timed out after 30 seconds'));
    }, 30000);

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        return reject(new Error(`Python script exited with code ${code}. Error: ${errorData}`));
      }
      try {
        const parsed = JSON.parse(outputData.trim());
        resolve(parsed);
      } catch (err) {
        reject(new Error('Failed to parse Python script output as JSON'));
      }
    });

    pythonProcess.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
};
