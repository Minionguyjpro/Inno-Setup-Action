// main.test.js
const core = require("@actions/core");
const fs = require("fs");
const main = require("../src/main");

// Mocking fs.promises for the test
jest.mock("fs", () => {
  const originalFs = jest.requireActual("fs");
  return {
    ...originalFs,
    promises: {
      access: jest.fn(),
    },
  };
});
const child_process = require("child_process");

jest.mock("@actions/core");
jest.mock("child_process");

describe("Inno Setup Action", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should execute Inno Setup command on Windows with existing workspace", () => {
    process.platform = "win32";
    main();

    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.promises.access).toHaveBeenCalled(); // Testing promises property
    expect(child_process.exec).toHaveBeenCalled();
  });

  // Add more test cases as needed...

  // Add other test cases for different scenarios...
});
