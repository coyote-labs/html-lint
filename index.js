const reshape = require('reshape');
const allSettled = require('promise.allsettled');

const { getRules } = require('./dist/utils');
const { printViolations, handleExit } = require('./dist/error');

module.exports = async function(htmlFiles, config) {
  const runTimeArgs = {
    violations: {}
  };

  let lint = htmlFiles.map((file) => {
    return reshape({
      plugins: getRules(),
      fileMeta: {
        name: file.name,
        contents: file.contents.trim()
      },
      runtime: runTimeArgs
    }).process(file.contents.trim());
  });

  await allSettled(lint);

  let { violations  } = runTimeArgs;

  printViolations(violations);
  handleExit(violations);
}
