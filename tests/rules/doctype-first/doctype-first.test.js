const lint = require('../../../index');
const { getFileMeta } = require('../../utils');

global.console = {
  error: jest.fn()
};

test.each([
  'doctype-first/no-error.html',
  'doctype-first/no-error-leading-comments.html',
  'doctype-first/error-no-doctype.html',
  'doctype-first/error-no-doctype-leading-comments'
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
