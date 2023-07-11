const core = require('@actions/core');
// eslint-disable-next-line no-unused-vars
const github = require('@actions/github');

const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getInput('options');
const path = core.getInput('path');

var exec = require('child_process').exec;

if (process.platform === 'win32') {
    if (!workspacePath) {
        const code = 1;
        console.error('Error: the repository was not cloned! Please specify the actions/checkout Github Action before this step.')
        process.exit(code);
    }
    exec(`"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" ${options} "${path}"`,
         function (error, stdout, stderr) {
             console.log(stdout);
             console.log(stderr);
        }
        )} else {
    const code = 1;
    console.error('Error: this action is only supported on Windows!')
        process.exit(code);
}
