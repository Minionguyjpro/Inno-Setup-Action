# Requirements
The job that runs the action needs to have the following requirements:

* OS: Windows (I'd recommend to just use ``windows-latest``)
* The action``actions/checkout`` being specified **before** the ``Minionguypro/Inno-Setup-Action`` is in your job!
* An existing directory with an Inno Setup script in it, which is specified in the action. If not specified or it doesn't exist (or something inside the script isn't right to work with the workflow. See the [Introduction](https://inno-setup-action.readthedocs.io/en/latest/) page for more information), the action will fail with guarantee!

Support for Wine might be added in the future, but I'd need to do some research first and it isn't planned for now.
