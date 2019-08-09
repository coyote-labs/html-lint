const fs = require('fs');
const reshape = require('reshape');
const allSettled = require('promise.allsettled');

const htmlFiles = [
  {
    contents: fs.readFileSync('./tests/sample-a.html').toString(),
    name: 'tests/sample-a.html'
  },
  {
    contents: fs.readFileSync('./tests/sample-b.html').toString(),
    name: 'tests/sample-b.html'
  }
];

const { DoctypeFirst } = require('./dist/rules/doctype-first');
const { IdUnique } = require('./dist/rules/id-unique');
const { IdAdDisabled } = require('./dist/rules/id-ad-disabled');
(async() => {
  const runTimeArgs = {
    errors: []
  };

  try {
    let lint = htmlFiles.map((file) => {
      return reshape({
        plugins: [
          new IdAdDisabled().lint,
          new DoctypeFirst().lint,
          new IdUnique().lint
        ],
        fileMeta: {
          name: file.name,
          contents: file.contents.trim()
        },
        runtime: runTimeArgs
      }).process(file.contents.trim());
    });

    await allSettled(lint);
    let { errors } = runTimeArgs;
    errors.forEach((error) => {
      console.log(error);
      console.log('\n');
    });

    if (errors.length) {
      process.exit(-1);
    }
  } catch({ message }) {
    console.error(message)
  }
})();
