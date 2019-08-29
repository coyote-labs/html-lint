const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/inline-style-disabled/no-error.html',
  'tests/rules/inline-style-disabled/error-inline-style-disabled.html',
])(
  'doctype-first %s',
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
