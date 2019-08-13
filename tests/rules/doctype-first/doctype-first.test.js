const lint = require('../../../index');
const { getFileMeta } = require('../../../dist/utils');

global.console = {
  error: jest.fn()
};

test.each([
  'tests/rules/doctype-first/no-error.html',
  'tests/rules/doctype-first/no-error-leading-comments.html',
  'tests/rules/doctype-first/error-no-doctype.html',
  'tests/rules/doctype-first/error-no-doctype-leading-comments'
])(
  'doctype-first %s',
  async(fixture) => {
    try {
      await lint([getFileMeta(fixture)]);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
    }
  },
);
