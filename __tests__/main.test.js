const core = require("@actions/core");

// Mocking specific methods of @actions/core
core.getInput = jest.fn().mockReturnValueOnce("options").mockReturnValueOnce("path");
core.setFailed = jest.fn();

jest.mock("fs", () => ({
  existsSync: jest.fn(() => true),
  readdirSync: jest.fn(() => ['file1', 'file2']),
}));

jest.mock('child_process', () => ({
  exec: jest.fn((command, options, callback) => {
    // Simulate a successful execution
    callback(null, 'stdout', 'stderr');
  }),
}));

// Importing the main module after the mocks are set
const main = require("../src/main");

// Add your test cases here
