const { htmlLint } = require('../../../index');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('file-level-config', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('off', async() => {
    await htmlLint('tests/e2e/file-level-config/fixtures/off.html');

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });
});
