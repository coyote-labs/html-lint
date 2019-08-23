const { htmlLint } = require('../../index');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

test('html-lint throws on errors', async () => {
  expect.hasAssertions();

  try {
    await htmlLint('tests/sample*.html');
  } catch ({ message }) {
    expect(message).toMatch('html-lint failed.');
    expect(global.console.error).toMatchSnapshot();
  }
});
