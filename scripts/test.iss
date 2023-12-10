; Test script to test the GitHub action.

#define MyAppName "My Test Application"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Minionguyjpro"
#define MyAppExeName "MyTestApp.exe"
#define MyAppAssocName MyAppName + ""
#define MyAppAssocExt ".exe"
#define MyAppAssocKey StringChange(MyAppAssocName, " ", "") + MyAppAssocExt

[Setup]
AppId={{28B07C0D-2BDE-4C64-B083-959BAAE5FECF}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
OutputDir=D:\a\Inno-Setup-Action\Inno-Setup-Action\
ChangesAssociations=yes
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
;PrivilegesRequired=lowest
OutputBaseFilename=MyTestApp-setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
