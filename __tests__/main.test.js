const core = require("@actions/core");
const fs = require("fs");
const childProcess = require("child_process");

// Mocking specific methods of @actions/core
core.getInput = jest.fn().mockReturnValueOnce("options").mockReturnValueOnce("path");
core.setFailed = jest.fn();

// Mocking fs and child_process modules
jest.mock("fs", () => ({
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ['file1', 'file2']),
}));

jest.mock("child_process", () => ({
  exec: jest.fn((command, options, callback) => {
    // Simulate a successful execution
    callback(null, 'stdout', 'stderr');
  }),
}));

// Importing the main module after the mocks are set
const main = require("../src/main");

describe("Inno Setup Action", () => {
  it("should execute Inno Setup command on Windows with existing workspace", () => {
    process.platform = "win32";
    main();
    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(fs.existsSync).toHaveBeenCalled();
    expect(childProcess.exec).toHaveBeenCalledWith(
      expect.stringContaining("iscc.exe"),
      expect.any(Object),
      expect.any(Function)
    );
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it("should set failed if workspace doesn't exist", () => {
    process.platform = "win32";
    fs.existsSync.mockReturnValueOnce(false);
    main();
    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(fs.existsSync).toHaveBeenCalled();
    expect(childProcess.exec).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledWith(
      "The repository was not cloned. Please specify the actions/checkout action before this step."
    );
  });

  it("should set failed if platform is not Windows", () => {
    process.platform = "linux";
    main();
    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(childProcess.exec).not.toHaveBeenCalled();
    expect(core.setFailed).toHaveBeenCalledWith("This action is only supported on Windows!");
  });

  // Add more test cases as needed
});
