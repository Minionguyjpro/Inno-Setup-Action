const core = require('@actions/core');

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ['file1', 'file2']),
}));

jest.mock('child_process', () => ({
  exec: jest.fn((command, options, callback) => {
    // Simulate a successful execution
    callback(null, 'stdout', 'stderr');
  }),
}));

describe('Inno Setup Action', () => {
  let originalPlatform;

  beforeAll(() => {
    // Save the original value of process.platform
    originalPlatform = process.platform;
  });

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore the original value of process.platform after all tests
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('should handle Windows platform', async () => {
    process.env.GITHUB_WORKSPACE = '/path/to/workspace';
    await require('../src/main');
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled();
  });

  it('should handle missing GitHub workspace', async () => {
    process.env.GITHUB_WORKSPACE = '/path/to/nonexistent/workspace';
    await require('../src/main');
    expect(core.setFailed).toHaveBeenCalledWith('The repository was not cloned. Please specify the actions/checkout action before this step.');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle Windows platform error', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      // Do nothing
    });

    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });
    await require('../src/main');

    expect(core.setFailed).toHaveBeenCalledWith('This action is only supported on Windows!');
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Restore the original implementation of process.exit
    exitSpy.mockRestore();
  });

  it('should handle Inno Setup compiler error', async () => {
    jest.spyOn(process, 'exit').mockImplementation((code) => {
      // Do nothing
    });

    // Simulate an error during the execution of the Inno Setup compiler
    jest.spyOn(require('child_process'), 'exec').mockImplementationOnce((command, options, callback) => {
      callback(new Error('Inno Setup compiler error'), 'stdout', 'stderr');
    });

    await require('../src/main');

    expect(core.setFailed).toHaveBeenCalledWith('stderr');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
