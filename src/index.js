import * as core from "@actions/core";
import { promises as fs } from "fs";
import { exec, execFile } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);
const execFilePromise = promisify(execFile);

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
        "The repository was not cloned. Please specify the actions/checkout action before this step.",
      );
    }

    const escapedOptions = options.map((str) => str.replace(/(["'])/g, "$1"));

    // Install Inno Setup silently
    try {
      const { stdout, stderr } = await execPromise(
        `winget install --id JRSoftware.InnoSetup -e -s winget -h`,
      );
      console.log(stdout);
      console.error(stderr);
    } catch (err) {
      throw new Error(
        `Failed to install Inno Setup: ${err.stderr || err.message}`,
      );
    }

    // Run Inno Setup Compiler
    const isccPath = `${process.env["ProgramFiles(x86)"]}\\Inno Setup 6\\iscc.exe`;
    const scriptPath = `${workspacePath}\\${path}`;

    try {
      const { stdout, stderr } = await execFilePromise(isccPath, [
        ...escapedOptions,
        scriptPath,
      ]);
      console.log(stdout);
      console.error(stderr);
    } catch (err) {
      throw new Error(`Execution failed: ${err.stderr || err.message}`);
    }

    console.log("Inno Setup script compiled successfully.");
  } catch (error) {
    core.setFailed(error.message || "An unknown error occurred.");
    process.exit(1);
  }
}

run();
