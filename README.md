# Inno-Setup-Action
![GitHub Release](https://img.shields.io/github/v/release/Minionguyjpro/Inno-Setup-Action)
![GitHub branch check runs](https://img.shields.io/github/check-runs/Minionguyjpro/Inno-Setup-Action/main?nameFilter=test)
![GitHub Issues](https://img.shields.io/github/issues/Minionguyjpro/Inno-Setup-Action)

GitHub action to compile .iss (Inno Setup Script) files, to build your own application installers through GitHub Actions. This way it is possible to automatically build installers for Windows software against CI/CD.
### Example Usage
Make for example the file ``/.github/workflows/build.yml`` with the following contents:
```yml
name: Build Installer
on: push
jobs:
  build:
    name: Build the Inno Setup Installer
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Compile .ISS to .EXE Installer
        uses: Minionguyjpro/Inno-Setup-Action@v1.2.2
        with:
          path: src/setup.iss
          options: /O+
```
The action will report that it saved the installer around in ``D:\YOURREPONAME\YOURREPONAME\`` and possibly in another directory (depending on how the output directory is defined in your .iss script). In this case, ``D:\YOURREPONAME\YOURREPONAME\`` is the root directory of your cloned GitHub repository workspace in the action. Keep this path layout into consideration if you need it for other steps in your workflow. 
For example, if you'd choose to save the setup file in the root directory (by example not specifying a custom directory) and calling it setup.exe, it would be at ``D:\YOURREPONAME\YOURREPONAME\setup.exe``. If you need to upload artifacts of your installer, then you should therefore use this path or specify the path relative to the workspace directory.

---
| **Key Name** | **Required** | **Example**        | **Default Value** | **Description**
|--------------|--------------|--------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
| ``path``     | Yes          | ``src/setup.iss``  | N/A               | Path to input .iss script file.                                                                                                     
| ``options``  | No           | ``/O+``            | N/A               | Extra arguments/options to include. Include the slashes for them. See [this page](https://jrsoftware.org/ishelp/index.php?topic=compilercmdline) for more information.                                                                                                                                  |
