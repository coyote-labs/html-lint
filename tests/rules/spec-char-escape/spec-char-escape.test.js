const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/spec-char-escape/error.html',
])(
  'spec-char-escape %s',
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
