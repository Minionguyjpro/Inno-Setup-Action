const core = require("@actions/core");
const fs = require("fs").promises;
const { execFile } = require("child_process");

const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getMultilineInput("options");
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
        // Escaping quotes in the options array
        const escapedOptions = options.map(str => str.replace(/(["'])/g, '\\$1'));

        // Debugging output to check the escaped options
        console.log('Escaped Options:', escapedOptions);

        execFile(
          `${process.env["ProgramFiles(x86)"]}\\Inno Setup 6\\iscc.exe`,
          [...escapedOptions, `${workspacePath}\\${path}`],
          (execError, stdout, stderr) => {
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
            if (execError) {
              core.setFailed(`Execution failed with error: ${stderr}`);
              process.exit(execError.code || 1);
            }
          },
        );
      } else {
        throw new Error(
          "The repository was not cloned. Please specify the actions/checkout action before this step.",
        );
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
