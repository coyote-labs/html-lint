const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/attr-unsafe-chars/error.html',
])(
  'attr-unsafe-chars %s',
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
