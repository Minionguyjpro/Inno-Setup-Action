// main.test.js

const fs = require('fs');
const childProcess = require('child_process');
const { testFunction } = require('../src/main');

jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setFailed: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
}));

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('Test suite for index.js', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  test('Handles Windows platform with existing repository', () => {
    process.platform = 'win32';
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(['file1', 'file2']);
    childProcess.exec.mockImplementation((command, options, callback) => {
      // Simulate successful execution
      callback(null, 'stdout content', 'stderr content');
    });

    // Call the function you want to test
    testFunction();

    // Assertions
    expect(fs.existsSync).toHaveBeenCalledWith(process.env.GITHUB_WORKSPACE);
    expect(fs.readdirSync).toHaveBeenCalledWith(process.env.GITHUB_WORKSPACE);
    expect(childProcess.exec).toHaveBeenCalled();
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  test('Handles Windows platform with missing repository', () => {
    process.platform = 'win32';
    fs.existsSync.mockReturnValue(false);

    // Call the function you want to test
    testFunction();

    // Assertions
    expect(core.setFailed).toHaveBeenCalledWith(
      'The repository was not cloned. Please specify the actions/checkout action before this step.'
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  test('Handles non-Windows platform', () => {
    process.platform = 'linux';

    // Call the function you want to test
    testFunction();

    // Assertions
    expect(core.setFailed).toHaveBeenCalledWith('This action is only supported on Windows!');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
