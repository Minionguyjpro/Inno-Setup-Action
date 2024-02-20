# Inno-Setup-Action
GitHub action to compile .iss (Inno Setup Script) files.
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
The action will tell you it saved the file somewhere around in ``D:\YOURREPONAME\YOURREPONAME\`` and maybe in another directory (depends on how you've defined the output directory in your .iss script). In this case, ``D:\YOURREPONAME\YOURREPONAME\`` is the root directory of your cloned GitHub repository workspace in the action. Keep this path layout in mind if you need it for other things in your workflow. If you'd choose to save the setup file in the root directory (by example not specifing a custom directory) and calling it setup.exe, it would be at ``D:\YOURREPONAME\YOURREPONAME\setup.exe``.

---
| **Key Name** | **Required** | **Example**        | **Default Value** | **Description**
|--------------|--------------|--------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
| ``path``     | Yes          | ``src/setup.iss``  | N/A               | Path to input .iss script file.                                                                                                     
| ``options``  | No           | ``/O+``            | N/A               | Extra arguments/options to include. Include the slashes for them. See [this page](https://jrsoftware.org/ishelp/index.php?topic=compilercmdline) for more information.                                                                                                                                  |
