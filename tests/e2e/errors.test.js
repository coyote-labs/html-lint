const lint = require('../../index');
const { getRulesList } = require('../../dist/utils');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

test('html-lint throws on errors', async () => {
  expect.hasAssertions();

  try {
    await lint('tests/sample*.html');
  } catch ({ message }) {
    expect(message).toMatch('html-lint failed.');
    expect(global.console.error).toMatchSnapshot();
  }
});
