const core = require("@actions/core");
const fs = require("fs").promises;
const { execFile } = require("child_process");

const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getInput("options");
const path = core.getInput("path");

let repoError;
let platformError;

async function run() {
  try {
    if (process.platform === "win32") {
      let workspaceExists;
      try {
        await fs.access(workspacePath);
        workspaceExists = true;
      } catch {
        workspaceExists = false;
      }
      
      const workspaceNotEmpty = (await fs.readdir(workspacePath)).length > 0;

      if (workspaceExists && workspaceNotEmpty) {
        execFile(
          `${process.env["ProgramFiles(x86)"]}\\Inno Setup 6\\iscc.exe`,
          [options, `${workspacePath}\\${path}`],
          (execError, stdout, stderr) => {
            console.log(stdout);
            if (execError) {
              core.setFailed(`Execution failed with error: ${stderr}`);
              process.exit(execError.code || 1);
            }
          }
        );
      } else {
        throw new Error("The repository was not cloned. Please specify the actions/checkout action before this step.");
      }
    } else {
      throw new Error("This action is only supported on Windows!");
    }
  } catch (error) {
    core.setFailed(error.message);
    process.exit(1);
  }
}

run();
