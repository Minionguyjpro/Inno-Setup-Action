import * as core from "@actions/core";
import { promises as fs } from "fs";
import { createWriteStream } from "fs";
import { exec, execFile } from "child_process";
import { promisify } from "util";
import { spawn } from "child_process";
import https from "https";
import os from "os";
import pathModule from "path";


const workspacePath = process.env.GITHUB_WORKSPACE;
const options = core.getMultilineInput("options");
const scriptInput = core.getInput("path");
const installLatest =
  (core.getInput("install_latest") || "false").toLowerCase() === "true";
const installerUrl =
  core.getInput("installer_url") ||
  "https://jrsoftware.org/download.php/is.exe?site=1";

function spawnPromise(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

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

    async function downloadFile(url, dest) {
      return new Promise((resolve, reject) => {
        const maxRedirects = 5;
        function getUrl(u, redirects) {
          if (redirects > maxRedirects)
            return reject(
              new Error("Too many redirects while downloading installer"),
            );
          https
            .get(u, (res) => {
              if (
                res.statusCode >= 300 &&
                res.statusCode < 400 &&
                res.headers.location
              ) {
                return getUrl(res.headers.location, redirects + 1);
              }
              if (res.statusCode !== 200) {
                return reject(
                  new Error(`Download failed with status ${res.statusCode}`),
                );
              }
              const file = createWriteStream(dest);
              res.pipe(file);
              file.on("finish", () => file.close(resolve));
              file.on("error", reject);
            })
            .on("error", reject);
        }
        getUrl(url, 0);
      });
    }

    async function findIscc() {
      const candidates = [];
      const pf86 = process.env["ProgramFiles(x86)"];
      const pf = process.env["ProgramFiles"];
      if (pf86) {
        candidates.push(pathModule.join(pf86, "Inno Setup 6", "iscc.exe"));
        candidates.push(pathModule.join(pf86, "Inno Setup 7", "iscc.exe"));
        candidates.push(pathModule.join(pf86, "Inno Setup", "iscc.exe"));
      }
      if (pf) {
        candidates.push(pathModule.join(pf, "Inno Setup 6", "iscc.exe"));
        candidates.push(pathModule.join(pf, "Inno Setup 7", "iscc.exe"));
        candidates.push(pathModule.join(pf, "Inno Setup", "iscc.exe"));
      }

      for (const p of candidates) {
        try {
          await fs.access(p);
          return p;
        } catch (e) {
          // ignore
        }
      }

      // Fallback to 'where' to see if it's on PATH
      try {
        const { stdout } = await spawnPromise("where", ["iscc.exe"], { shell: true });
        const line = stdout.split(/\r?\n/).find(Boolean);
        if (line) return line.trim();
      } catch (e) {
        // ignore
      }

      return null;
    }

    // Install Inno Setup: either download+install latest or fallback to choco
    if (installLatest) {
      const tmpExe = pathModule.join(
        os.tmpdir(),
        `inno-setup-installer-${Date.now()}.exe`,
      );
      try {
        core.info(`Downloading Inno Setup from ${installerUrl}…`);
        await downloadFile(installerUrl, tmpExe);
        core.info(`Running installer silently: ${tmpExe}`);
        await spawnPromise(tmpExe, [
          "/VERYSILENT",
          "/SUPPRESSMSGBOXES",
          "/NORESTART",
          "/SP-",
        ]);
        core.info(`Done installing`);
      } catch (err) {
        core.warning(
          `Download/install failed: ${err.message}. Falling back to Chocolatey.`,
        );
        try {
          core.info(`Installing Inno Setup via choco…`);
          await spawnPromise("choco", ["install", "innosetup", "-y"]);
          core.info(`Installed.`);
        } catch (err2) {
          throw new Error(
            `Failed to install Inno Setup: ${err2.stderr || err2.message}`,
          );
        }
      }
    } else {
      try {
        core.info(`Installing Inno Setup via choco…`);
        await spawnPromise("choco", ["install", "innosetup", "-y"]);
          core.info(`Installed.`);
      } catch (err) {
        throw new Error(
          `Failed to install Inno Setup: ${err.stderr || err.message}`,
        );
      }
    }

    // Locate iscc.exe
    const isccPath = await findIscc();
    if (!isccPath) {
      throw new Error("Could not locate iscc.exe after installation.");
    }

    const scriptPath = pathModule.join(workspacePath, scriptInput);

    try {
      core.info(`Running iscc…`);
      await spawnPromise(isccPath, [
        scriptPath,
        ...escapedOptions,
      ]);
    } catch (err) {
      throw new Error(`Execution failed: ${err.stderr || err.message}`);
    }

    console.log("Inno Setup script compiled successfully.");
  } catch (error) {
    core.setFailed(error.message || "An unknown error occurred.");
  }
}

run();
