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

  test('mixed', async() => {
    expect.hasAssertions();

    try {
      await htmlLint('tests/e2e/file-level-config/fixtures/mixed.html');
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
      expect(global.console.warn).toMatchSnapshot();
      expect(global.console.log).toMatchSnapshot();
    }
  });
});
