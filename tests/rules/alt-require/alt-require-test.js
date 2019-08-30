const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};


test.each([
  'tests/rules/alt-require/error-no-alt.html',
  'tests/rules/alt-require/no-error-empty-alt.html',
  'tests/rules/alt-require/no-error.html',
])(
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
