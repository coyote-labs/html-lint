const fs = require('fs');
const lint = require('../../index');
const { getRulesList } = require('../../dist/utils');

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
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

test('html-lint throws on errors', async () => {
  expect.hasAssertions();

  try {
    await lint(htmlFiles);
  } catch ({ message }) {
    expect(message).toMatch('html-lint failed.');
    expect(global.console.error).toMatchSnapshot();
  }
});
