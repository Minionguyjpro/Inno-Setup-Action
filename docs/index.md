# Introduction
[![GitHub Issues](https://img.shields.io/github/issues-raw/Minionguyjpro/Inno-Setup-Action.svg)](https://github.com/Minionguyjpro/Inno-Setup-Action/issues)
[![Build and Publish](https://github.com/Minionguyjpro/Inno-Setup-Action/workflows/Run%20a%20test/badge.svg)](https://github.com/Minionguyjpro/Inno-Setup-Action/actions)

This is an action that can be used in a workflow that uses GitHub Actions, in order to build a setup executable based on a specified location of a script in a location on GitHub. You'll need to make sure you point to the right location in the script file with stuff, like you need to specify the location of the GitHub executable like ``D:\REPONAME\REPONAME\THEFINALPATHTOYOURSTUFFGOESHIER``.

``D:\REPONAME\REPONAME`` is the location of where's the root of your GitHub repository. Just make sure to specify the ``actions/checkout`` action as step before you'll use this action, and the path is set correctly like that in your Inno Setup script for compilation!
