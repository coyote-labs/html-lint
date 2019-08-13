const { toPascalCase } = require('../../dist/utils');

test('toPascalCase works', () => {
  expect(toPascalCase('id-ad-disabled')).toBe('IdAdDisabled');
  expect(toPascalCase('Id-ad-diSabled')).toBe('IdAdDiSabled');
  expect(toPascalCase('id-ad-diSabled')).toBe('IdAdDiSabled');
  expect(toPascalCase('idaddiSabled')).toBe('IdaddiSabled');
});
