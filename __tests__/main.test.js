// main.js

const core = require("@actions/core");
const fs = require("fs");

function main() {
  const workspacePath = process.env.GITHUB_WORKSPACE;

  const options = core.getInput("options");
  const path = core.getInput("path");

  let repoError;
  let platformError;

  if (process.platform === "win32") {
    if (fs.existsSync(workspacePath) && fs.readdirSync(workspacePath).length > 0) {
      exec(`"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" ${options} "${workspacePath}\\${path}"`, { stdio: "ignore" }, function (execError, stdout, stderr) {
        console.log(stdout);

        if (execError) {
          repoError = { code: execError.code || 1 };
          core.setFailed(stderr);
          process.exit(repoError.code);
        }
      });
    } else {
      repoError = { code: 1 };
      core.setFailed("The repository was not cloned. Please specify the actions/checkout action before this step.");
      process.exit(repoError.code);
    }
  } else {
    platformError = { code: 1 };
    core.setFailed("This action is only supported on Windows!");
    process.exit(platformError.code);
  }
}

module.exports = main;
