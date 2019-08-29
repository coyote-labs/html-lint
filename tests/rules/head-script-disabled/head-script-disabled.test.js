const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/head-script-disabled/error.html'
])(
  'head-script-disabled %s',
  async(fixture) => {
    try {
      await htmlLint(fixture);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
