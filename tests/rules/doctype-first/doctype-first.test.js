const lint = require('../../../index');
const { getFileMeta } = require('../../utils');

global.console = {
  error: jest.fn()
};

test.each([
  'rules/doctype-first/no-error.html',
  'rules/doctype-first/no-error-leading-comments.html',
  'rules/doctype-first/error-no-doctype.html',
  'rules/doctype-first/error-no-doctype-leading-comments'
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
