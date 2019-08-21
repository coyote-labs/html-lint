const fs = require('fs');
const reshape = require('reshape');
const glob = require('glob');
const allSettled = require('promise.allsettled');

const { getRules } = require('./dist/utils');
const { report, printUsage } = require('./dist/error');

module.exports = async function(htmlFilesGlob) {
  let htmlFiles;
  try {
    htmlFiles = Array.isArray(htmlFilesGlob) ? htmlFilesGlob : glob.sync(htmlFilesGlob);
  } catch ({ message }) {
    console.error(message);
    printUsage();
  }

  htmlFiles = htmlFiles.map((file) => {
    return {
      contents: fs.readFileSync(file).toString(),
      name: file
    };
  });

  const runTimeArgs = {
    violations: {},
    htmlLintConfig: {}
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

  report(runTimeArgs);
}
