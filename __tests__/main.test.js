// main.test.js

const core = require('@actions/core');
const fs = require('fs');
const { exec } = require('child_process');

// Mock the @actions/core module
jest.mock('@actions/core');

// ... other imports and setup ...

describe('Test suite for main.js', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should handle repository not cloned error', async () => {
    // Mock fs.existsSync to simulate repository not cloned scenario
    fs.existsSync.mockReturnValue(false);

    // Run your function that checks the repository
    await require('../src/main');

    // Verify that the error is set and the process is exited
    expect(core.setFailed).toHaveBeenCalledWith('The repository was not cloned. Please specify the actions/checkout action before this step.');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle Windows platform error', async () => {
    // Mock process.platform to simulate non-Windows scenario
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });

    // Run your function that checks the platform
    await require('../src/main');

    // Verify that the error is set and the process is exited
    expect(core.setFailed).toHaveBeenCalledWith('This action is only supported on Windows!');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should execute Inno Setup compiler command on Windows', async () => {
    // Mock fs.existsSync to simulate repository cloned scenario
    fs.existsSync.mockReturnValue(true);

    // Mock process.platform to simulate Windows scenario
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    });

    // Mock child_process.exec to simulate a successful execution
    exec.mockImplementation((command, options, callback) => {
      callback(null, 'stdout', 'stderr');
    });

    // Run your function that executes the Inno Setup compiler command
    await require('../src/main');

    // Verify that the process is not exited and no error is set
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled();
  });

  afterEach(() => {
    // Restore the original environment variables after each test
    jest.resetModules();
  });
});
