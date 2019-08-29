const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/src-not-empty/no-error.html',
  'tests/rules/src-not-empty/error-empty-src.html',
  'tests/rules/src-not-empty/error-no-src-attr.html'
])(
  'src-not-empty %s',
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
