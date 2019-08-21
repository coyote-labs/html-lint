global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('file-level-config', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('warn', async() => {
    const lint = require('../../../index');
    await lint('tests/e2e/file-level-config/fixtures/warn.html');

    expect(global.console.error).not.toHaveBeenCalled();
    expect(global.console.error).toMatchSnapshot();
    expect(global.console.warn).toMatchSnapshot();
    expect(global.console.log).toMatchSnapshot();
  });
});
