const {htmlLint} = require('../../../index');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/doctype-first/no-error.html',
  'tests/rules/doctype-first/no-error-leading-comments.html',
  'tests/rules/doctype-first/error-no-doctype.html',
  'tests/rules/doctype-first/error-no-doctype-leading-comments.html'
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
