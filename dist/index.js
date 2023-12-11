const fs = require('fs');
const core = require('@actions/core');
// eslint-disable-next-line no-unused-vars
const github = require('@actions/github');

const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getInput('options');
const path = core.getInput('path');

var exec = require('child_process').exec;

if (process.platform === 'win32') {
  if (fs.existsSync(process.env.GITHUB_WORKSPACE)) {
    exec(`"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" ${options} "${workspacePath}\\${path}"`, { stdio: 'ignore' }, function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error) {
        const code = error.code || 1;
        process.exit(code);
      }
    });
  } else {
    const code = 1;
    console.error('Error: The repository was not cloned. Please specify the actions/checkout action before this step.');
    process.exit(code);
  }
} else {
  const code = 1;
  console.error('Error: This action is only supported on Windows!');
  process.exit(code);
}
