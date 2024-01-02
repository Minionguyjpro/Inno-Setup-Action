/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 177:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// Importing necessary modules
const fs = __nccwpck_require__(147);
const core = __nccwpck_require__(450);
// eslint-disable-next-line no-unused-vars
const github = __nccwpck_require__(177);

// Getting the path to the workspace from environment variables
const workspacePath = process.env.GITHUB_WORKSPACE;

// Getting inputs from the workflow
const options = core.getInput('options');
const path = core.getInput('path');

// Importing the child_process module for executing shell commands
var exec = (__nccwpck_require__(81).exec);

// Initializing an error variable
let error;

// Checking if the platform is Windows
if (process.platform === 'win32') {
  // Checking if the GitHub workspace exists and is not empty
  if (fs.existsSync(process.env.GITHUB_WORKSPACE) && fs.readdirSync(workspacePath).length > 0) {
    // Building and executing the Inno Setup compiler command
    exec(`"%PROGRAMFILES(X86)%\\Inno Setup 6\\iscc.exe" ${options} "${workspacePath}\\${path}"`, { stdio: 'ignore' }, function (error, stdout, stderr) {
      // Logging the standard output of the command
      console.log(stdout);

      // Handling errors, if any
      if (error) {
        core.setFailed(stderr);
        process.exit(error.code || 1);
      }
    });
  } else {
    // Setting an error code and failing the workflow if the repository is not cloned
    error = { code: 1 }
    core.setFailed('The repository was not cloned. Please specify the actions/checkout action before this step.');
    process.exit(error.code);
  }
} else {
  // Setting an error code and failing the workflow if the platform is not Windows
  error = { code: 1 };
  core.setFailed('This action is only supported on Windows!');
  process.exit(error.code);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;