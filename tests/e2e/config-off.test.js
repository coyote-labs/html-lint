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

describe('global config - ignore all rules', () => {
  beforeEach(() => {
    jest.resetModules();

    let rules = getRulesList();
    rules.forEach(rule => global.process.env[rule.name] = 'off');
  });

  test('html-lint does not throw when all rules are set to off', async () => {
    await lint(htmlFiles);
    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

  afterEach(() => {
    let rules = getRulesList();
    rules.forEach(rule => global.process.env[rule.name] = 'error');
  });
});
