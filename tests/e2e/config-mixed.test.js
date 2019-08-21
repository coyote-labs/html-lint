const lint = require('../../index');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('global config - ignore some rules', () => {
  beforeEach(() => {
    jest.resetModules();

    process.env['doctype-first'] = 'warn';
    process.env['class-ad-disabled'] = 'off';
  });

  test('html-lint throws when a few rules are set to error', async () => {
    expect.hasAssertions();

    try {
      await lint('tests/sample*.html');
    } catch({ message }) {
      expect(global.console.warn).toHaveBeenCalled();
      expect(global.console.error).toHaveBeenCalled();

      expect(global.console.warn).toMatchSnapshot();
      expect(global.console.error).toMatchSnapshot();

      expect(global.console.log).not.toHaveBeenCalled();
    }
  });

  afterEach(() => {
    process.env['doctype-first'] = 'error';
    process.env['class-ad-disabled'] = 'error';
  });
});
