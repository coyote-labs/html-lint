const lint = require('../../index');
const { getRulesList } = require('../../dist/utils');

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
    await lint('tests/sample*.html');
    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

  afterEach(() => {
    let rules = getRulesList();
    rules.forEach(rule => global.process.env[rule.name] = 'error');
  });
});
