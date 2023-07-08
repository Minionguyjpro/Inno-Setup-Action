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
      - uses: actions/checkout@v3

      - name: Compile .ISS to .EXE Installer
        uses: Minionguyjpro/Inno-Setup-Action@v1.0.0
        with:
          path: /src/setup.iss
          options: /O+
```

---
| **Key Name** | **Required** | **Example**    | **Default Value** | **Description**                                                                                                                                                        |
|--------------|--------------|----------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ``path``     | Yes          | /src/setup.iss | N/A               | Path to input .iss script file.                                                                                                                                        |
| ``options``  | No           | /O+            | N/A               | Extra arguments/options to include. Include the slashes for them. See [this page](https://jrsoftware.org/ishelp/index.php?topic=compilercmdline) for more information. |
