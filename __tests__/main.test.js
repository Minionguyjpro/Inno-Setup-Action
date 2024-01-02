// main.test.js
const core = require('@actions/core');
const fs = require('fs');
const main = require('../src/main'); // Update the path accordingly
const child_process = require('child_process');

jest.mock('@actions/core');
jest.mock('fs');
jest.mock('child_process');

describe('Inno Setup Action', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should execute Inno Setup command on Windows with existing workspace', () => {
    process.platform = 'win32';
    process.env.GITHUB_WORKSPACE = '/path/to/workspace';
    core.getInput.mockReturnValueOnce('options-value').mockReturnValueOnce('path-value');
    fs.existsSync.mockReturnValueOnce(true);
    fs.readdirSync.mockReturnValueOnce(['file1', 'file2']);

    main();

    expect(core.getInput).toHaveBeenCalledWith('options');
    expect(core.getInput).toHaveBeenCalledWith('path');
    expect(fs.existsSync).toHaveBeenCalledWith('/path/to/workspace');
    expect(fs.readdirSync).toHaveBeenCalledWith('/path/to/workspace');
    expect(child_process.exec).toHaveBeenCalledWith(
      '"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" options-value "/path/to/workspace\\path-value"',
      { stdio: 'ignore' },
      expect.any(Function)
    );
  });

  it('should handle error when executing Inno Setup command', () => {
    process.platform = 'win32';
    process.env.GITHUB_WORKSPACE = '/path/to/workspace';
    core.getInput.mockReturnValueOnce('options-value').mockReturnValueOnce('path-value');
    fs.existsSync.mockReturnValueOnce(true);
    fs.readdirSync.mockReturnValueOnce(['file1', 'file2']);
    const execError = new Error('Command execution failed');
    child_process.exec.mockImplementationOnce((command, options, callback) => {
      callback(execError, 'stdout-content', 'stderr-content');
    });

    main();

    expect(core.setFailed).toHaveBeenCalledWith('stderr-content');
    expect(process.exit).toHaveBeenCalledWith(execError.code || 1);
  });

  it('should handle repository not cloned error', () => {
    process.platform = 'win32';
    process.env.GITHUB_WORKSPACE = '/path/to/workspace';
    core.getInput.mockReturnValueOnce('options-value').mockReturnValueOnce('path-value');
    fs.existsSync.mockReturnValueOnce(false);

    main();

    expect(core.setFailed).toHaveBeenCalledWith('The repository was not cloned. Please specify the actions/checkout action before this step.');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle unsupported platform error', () => {
    process.platform = 'linux';

    main();

    expect(core.setFailed).toHaveBeenCalledWith('This action is only supported on Windows!');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
