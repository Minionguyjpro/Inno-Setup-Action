const core = require("@actions/core");
const { promises: fs } = require("fs");
const { exec, execFile } = require("child_process");

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        reject(new Error(`Command failed: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

function execFilePromise(file, args) {
  return new Promise((resolve, reject) => {
    execFile(file, args, (error, stdout, stderr) => {
      console.log(stdout);
      console.error(stderr);
      if (error) {
        reject(new Error(`Execution failed: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getMultilineInput("options");
const path = core.getInput("path");

async function run() {
  try {
    if (process.platform !== "win32") {
      throw new Error("This action is only supported on Windows!");
    }

    if (!workspacePath) {
      throw new Error("GITHUB_WORKSPACE is not defined.");
    }

    try {
      await fs.access(workspacePath);
    } catch {
      throw new Error("Workspace path does not exist.");
    }

    const files = await fs.readdir(workspacePath);
    if (files.length === 0) {
      throw new Error(
        "The repository was not cloned. Please specify the actions/checkout action before this step."
      );
    }

    const escapedOptions = options.map((str) => str.replace(/(["'])/g, "$1"));

    // Install Inno Setup silently
    await execPromise(
      `winget install --id JRSoftware.InnoSetup -e -s winget -h`
    );

    const isccPath = `${process.env["ProgramFiles(x86)"]}\\Inno Setup 6\\iscc.exe`;
    const scriptPath = `${workspacePath}\\${path}`;

    await execFilePromise(isccPath, [...escapedOptions, scriptPath]);

    console.log("Inno Setup script compiled successfully.");
  } catch (error) {
    core.setFailed(error.message || "An unknown error occurred.");
    process.exit(1);
  }
}

run();
