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

global.console = {
  error: jest.fn()
};

test('html-hint throws on errors', async () => {
  expect.assertions(1);

  try {
    await lint(htmlFiles);
  } catch ({ message }) {
    expect(message).toMatch('html-lint failed.');
  }
});

test('html-hint prints errors properly', async () => {
  try {
    await lint(htmlFiles);
  } catch ({ message }) {
    expect(global.console.error).toMatchSnapshot();
  }
});
