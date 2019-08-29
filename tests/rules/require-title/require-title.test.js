const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/require-title/no-error.html',
  'tests/rules/require-title/error-no-title.html',
  'tests/rules/require-title/error-no-head.html'
])(
  'require-title %s',
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
