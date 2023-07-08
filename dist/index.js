const core = require('@actions/core');
// eslint-disable-next-line no-unused-vars
const github = require('@actions/github');
const { exit } = require('process');

const options = core.getInput('options');
const path = core.getInput('path');

var exec = require('child_process').exec;

if (process.platform === 'win32') {
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
