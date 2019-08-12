const reshape = require('reshape');
const allSettled = require('promise.allsettled');

const { getRules } = require('./dist/utils');
const { printErrors, handleExit } = require('./dist/error');

module.exports = async function(htmlFiles) {
  const runTimeArgs = {
    errors: []
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
  let { errors } = runTimeArgs;

  printErrors(errors);
  handleExit(errors);
}
