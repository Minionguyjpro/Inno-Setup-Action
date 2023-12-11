const fs = require('fs');
const core = require('@actions/core');

const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getInput('options');
const path = core.getInput('path');

if (process.platform === 'win32') {
  try {
    if (fs.existsSync(workspacePath) && fs.readdirSync(workspacePath).length > 0) {
      const { stdout, stderr } = require('child_process').execSync(`"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" ${options} "${workspacePath}\\${path}"`, { stdio: 'pipe' });
      console.log(stdout);
      if (stderr) {
        throw new Error(stderr);
      }
    } else {
      throw new Error('The repository was not cloned. Please specify the actions/checkout action before this step.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
} else {
  core.setFailed('This action is only supported on Windows!');
}
