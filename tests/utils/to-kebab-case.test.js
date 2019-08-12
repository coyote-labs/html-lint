const { toKebabCase } = require('../../dist/utils');

test('toKebabCase works', () => {
  expect(toKebabCase('IdAdDisabled')).toBe('id-ad-disabled');
  expect(toKebabCase('IdAdDiSabled')).toBe('id-ad-di-sabled');
  expect(toKebabCase('IdaddiSabled')).toBe('idaddi-sabled');
});
