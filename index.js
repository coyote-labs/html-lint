const reshape = require('reshape');
const allSettled = require('promise.allsettled');
const chalk = require('chalk');

const { getRules } = require('./dist/utils');
const { printTitleForFile } = require('./dist/error');

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
  
  let files = Object.keys(errors);
  files.forEach((file) => {
    let fileErrors = errors[file];
    printTitleForFile(file, fileErrors.length);
    fileErrors.forEach(error => console.error(error, '\n'));
    console.error('\n');
  });

  if (files.length) {
    throw new Error(chalk.red('html-lint failed.'));
  }
}
