const main = require("../src/main");
const core = require("@actions/core");
const fs = require("fs");

// Mocking specific methods of @actions/core
core.getInput = jest.fn().mockReturnValueOnce("options").mockReturnValueOnce("path");
core.setFailed = jest.fn();

// Mocking fs module with promises property
jest.mock("fs", () => ({
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ['file1', 'file2']),
  promises: {
    access: jest.fn(),
  },
}));

// Importing the main module after the mocks are set
const main = require("../src/main");

describe("Inno Setup Action", () => {
  it("should execute Inno Setup command on Windows with existing workspace", () => {
    process.platform = "win32";
    main();
    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.promises.access).toHaveBeenCalled(); // Testing promises property
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  // Add more test cases as needed
});
