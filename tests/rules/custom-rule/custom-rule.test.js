const lint = require('../../../index');
const { getFileMeta } = require('../../../dist/utils');

global.console = {
  error: jest.fn(),
  warn: jest.fn()
};

beforeEach(() => {
  jest.resetModules();
  jest.mock('cosmiconfig');
  process.env['workingDir'] = __dirname;
});

test.each([
  'tests/rules/custom-rule/sample-a.html',
])(
  'custom-rule %s',
  async(fixture) => {
    expect.hasAssertions();
    try {
      await lint([getFileMeta(fixture)]);
    } catch ({ message }) {
      expect(global.console.error).toMatchSnapshot();
      expect(global.console.warn).toMatchSnapshot();
    }
  },
);

afterEach(() => {
  process.env['workingDir'] = '';
});
