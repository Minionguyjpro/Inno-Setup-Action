// Importing necessary modules
const core = require('@actions/core')
const fs = require('fs')

// Getting the path to the workspace from environment variables
const workspacePath = process.env.GITHUB_WORKSPACE

// Getting inputs from the workflow
const options = core.getInput('options')
const path = core.getInput('path')

// Importing the child_process module for executing shell commands
const exec = require('child_process').exec

// Initializing an error variable
let error;

// Checking if the platform is Windows
if (process.platform === 'win32') {
  // Checking if the GitHub workspace exists and is not empty
  if (fs.existsSync(process.env.GITHUB_WORKSPACE) && fs.readdirSync(workspacePath).length > 0) {
    // Building and executing the Inno Setup compiler command
    exec(`"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" ${options} "${workspacePath}\\${path}"`, { stdio: 'ignore' }, function (error, stdout, stderr) {
      // Logging the standard output of the command
      console.log(stdout)

      // Handling errors, if any
      if (error) {
        core.setFailed(stderr)
        process.exit(error.code || 1)
      }
    });
  } else {
    // Setting an error code and failing the workflow if the repository is not cloned
    error = { code: 1 }
    core.setFailed('The repository was not cloned. Please specify the actions/checkout action before this step.');
    process.exit(error.code)
  }
} else {
  // Setting an error code and failing the workflow if the platform is not Windows
  error = { code: 1 };
  core.setFailed('This action is only supported on Windows!')
  process.exit(error.code)
}
