import * as fs from 'fs';
import * as path from 'path';

import { BaseRule } from './rules/base-rule';

export function toCamelCase(str: string): string {
  let camelised = str.replace(/-([a-z])/g, function (match, word) {
    return word.toUpperCase();
  });

  return camelised.replace(/^./, camelised[0].toUpperCase());
}

export function getRules(): Array<BaseRule> {
  const rulesDir = path.join(__dirname, 'rules');
  const rules = fs.readdirSync(rulesDir).filter((rule) => {
    return path.extname(rule) === '.js' && !rule.includes('base-rule');
  });

  const plugins = rules.map((ruleFile) => {
    let ruleName = toCamelCase(path.parse(ruleFile).name);
    let rulePath = path.join(rulesDir, ruleFile);

    let rule = require(rulePath)[ruleName];
    return new rule().lint;
  });

  return plugins;
}
