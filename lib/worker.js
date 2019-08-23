const workerpool = require('workerpool');
const { linter } = require('../index');

async function runLint(files, options) {
  return await linter(files, options);
}

workerpool.worker({
  linter: runLint
});
