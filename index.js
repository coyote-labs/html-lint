require('v8-compile-cache');

const fs = require('fs');
const path = require('path');

const physicalCpuCount = require('physical-cpu-count')
const reshape = require('reshape');
const glob = require('glob');
const workerpool = require('workerpool');
const allSettled = require('promise.allsettled');
const chunk = require('lodash.chunk');
const merge = require('lodash.merge');

const { getRules } = require('./dist/utils');
const { printUsage, report } = require('./dist/error');

const pool = workerpool.pool(path.join(__dirname, './lib/worker.js'));

const runTimeArgs = {
  violations: {},
  htmlLintConfig: {},
  configPath: process.cwd()
};

const linter = async(files, runTimeArgs) => {
  let lint =  files.map((file) => {
    return reshape({
      plugins: getRules(runTimeArgs),
      fileMeta: {
        name: file.name,
        contents: file.contents.trim()
      },
      runtime: runTimeArgs
    }).process(file.contents.trim());
  });

  await allSettled(lint);
  return runTimeArgs;
};

const htmlLint = async function(htmlFilesGlob, configPath) {
  if (configPath) {
    runTimeArgs.configPath = configPath;
  }

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

  let chunks = chunk(htmlFiles, physicalCpuCount);

  let lintPromises = chunks.map((fileGroup) => {
    return pool.exec('linter', [fileGroup, runTimeArgs]);
  });

  let results = await allSettled(lintPromises);
  let combinedResults = merge({}, ...results.map(result => result.value));
  report(combinedResults, pool);
}

module.exports = {
  htmlLint,
  linter
}
