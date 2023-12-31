# Example Usage
Here is an example of a workflow that you can use as base for your workflow (change it to your own needs!):
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
In this example, we run the ``actions/checkout`` action **before** the ``Minionguyjpro/Inno-Setup-Action`` action! This is **required**. After that, we run our action as you should (unless you need to add anything in between the actions, but most probably shouldn't). Then we specify the path starting from our root, so the script is the ``setup.iss`` file in the ``src`` directory if you look at the root of the GitHub repository. Then we specify the ``/O+`` parameter, in order to force override the output to show, no matter what the script has specified.
