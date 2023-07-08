const core = require('@actions/core');
const github = require('@actions/github');
const { exit } = require('process');

const path = core.getInput('path');

var exec = require('child_process').exec;

if (process.platform === 'win32') {
exec('\"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe\" \"${path}\"',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    })} else {
console.error('Error: this action is only supported on Windows!')
code = 1; process.exit(code);
}