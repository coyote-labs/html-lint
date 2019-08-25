const { htmlLint } = require('../../../index');

global.console = {
  error: jest.fn(),
  warn: jest.fn()
};

beforeEach(() => {
  jest.resetModules();
});

test.each([
  'tests/e2e/custom-rule/sample-a.html',
])(
  'custom-rule %s',
  async(fixture) => {
    expect.hasAssertions();

    try {
      await htmlLint(fixture, __dirname);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
      expect(global.console.warn).toMatchSnapshot();
    }
  },
);
