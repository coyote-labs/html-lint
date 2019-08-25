const { htmlLint } = require('../../../../index');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('global config - ignore all rules', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('html-lint does not throw when all rules are set to off', async () => {
    await htmlLint('tests/sample*.html', __dirname);
    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });
});
