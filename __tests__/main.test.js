// main.test.js
const core = require("@actions/core");
const fs = require("fs");
const { main } = require("../src/main"); // Adjust the path accordingly

jest.mock("@actions/core");

describe("Inno Setup Action", () => {
  it("should execute Inno Setup command on Windows with existing workspace", () => {
    process.platform = "win32";
    main();
    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(fs.existsSync).toHaveBeenCalled();
  });
});
