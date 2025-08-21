import * as core from "@actions/core";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { execFile } from "child_process";

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
        const escapedOptions = options.map((str) =>
          str.replace(/(["'])/g, "$1"),
        );

        exec(
          `winget install --id JRSoftware.InnoSetup -e -s winget -h`,
          (execError, stdout, stderr) => {
            console.log(stdout, stderr);
            if (execError) {
              core.setFailed(`Failed to install Inno Setup: ${stderr}`);
              process.exit(execError.code || 1);
            }
          },
        );

        execFile(
          `${process.env["ProgramFiles(x86)"]}\\Inno Setup 6\\iscc.exe`,
          [...escapedOptions, `${workspacePath}\\${path}`],
          (execError, stdout, stderr) => {
            console.log(stdout, stderr);
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
