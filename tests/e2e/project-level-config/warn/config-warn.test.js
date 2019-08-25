const { htmlLint } = require('../../../../index');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('global config - warn all rules', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('html-lint does not throw when rules are set to warn', async () => {
    await htmlLint('tests/sample*.html', __dirname);
    expect(global.console.warn).toHaveBeenCalled();
    expect(global.console.warn).toMatchSnapshot();
    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });
});
