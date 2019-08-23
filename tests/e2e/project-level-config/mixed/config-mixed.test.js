const { htmlLint } = require('../../../../index');

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('global config - ignore some rules', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('html-lint throws when a few rules are set to error', async () => {
    expect.hasAssertions();

    try {
      await htmlLint('tests/sample*.html', __dirname);
    } catch({ message }) {
      expect(global.console.warn).toHaveBeenCalled();
      expect(global.console.error).toHaveBeenCalled();

      expect(global.console.warn).toMatchSnapshot();
      expect(global.console.error).toMatchSnapshot();

      expect(global.console.log).not.toHaveBeenCalled();
    }
  });
});
