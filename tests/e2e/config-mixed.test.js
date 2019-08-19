const fs = require('fs');
const lint = require('../../index');
const { getRulesList } = require('../../dist/utils');

const htmlFiles = [
  {
    contents: fs.readFileSync('./tests/sample-a.html').toString(),
    name: 'tests/sample-a.html'
  },
  {
    contents: fs.readFileSync('./tests/sample-b.html').toString(),
    name: 'tests/sample-b.html'
  }
];

global.console = {
  error: jest.fn().mockName('error'),
  warn: jest.fn().mockName('warn'),
  log: jest.fn().mockName('log')
};

describe('global config - ignore some rules', () => {
  beforeEach(() => {
    jest.resetModules();

    process.env['doctype-first'] = 'warn';
    process.env['class-ad-disabled'] = 'off';
  });

  test('html-lint throws when a few rules are set to error', async () => {
    expect.hasAssertions();

    try {
      await lint(htmlFiles);
    } catch({ message }) {
      expect(global.console.warn).toHaveBeenCalled();
      expect(global.console.error).toHaveBeenCalled();

      expect(global.console.warn).toMatchSnapshot();
      expect(global.console.error).toMatchSnapshot();

      expect(global.console.log).not.toHaveBeenCalled();
    }
  });

  afterEach(() => {
    process.env['doctype-first'] = 'error';
    process.env['class-ad-disabled'] = 'error';
  });
});
