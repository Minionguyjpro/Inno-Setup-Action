const core = require("@actions/core");

// Mocking the entire @actions/core module
jest.mock("@actions/core");

// Mocking specific methods
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

// Now, you can import and test your main.js module
const main = require("../src/main");

// Add your test cases here
