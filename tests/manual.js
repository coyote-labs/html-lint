const fs = require('fs');
const lint = require('../index');

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

(async() => {
  try {
    process.env['class-ad-disabled'] = 'off';
    process.env['id-ad-disabled'] = 'off';
    process.env['doctype-first'] = 'warn';
    process.env['id-unique'] = 'warn';
    await lint(htmlFiles);
  } catch (error) {
    console.log(error)
  }
})();
