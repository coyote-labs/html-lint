import * as fs from 'fs';
import * as path from 'path';

import { BaseRule } from './rules/base-rule';

const rulesDir = path.join(__dirname, 'rules');

export function toPascalCase(str: string): string {
  let camelised = str.replace(/-([a-z])/g, function (match, word) {
    return word.toUpperCase();
  });

  return camelised.replace(/^./, camelised[0].toUpperCase());
}

export function toKebabCase(str: string): string {
  return str.split(/(?=[A-Z])/).join('-').toLowerCase();
}

export function getRulesList(): Array<string> {
  let rules = fs.readdirSync(rulesDir).filter((rule) => {
    return path.extname(rule) === '.js' && !rule.includes('base-rule');
  });

  return rules.map((ruleFile) => path.parse(ruleFile).name);
}

export function getRules(): Array<BaseRule> {
  const rules = getRulesList();
  const plugins = rules.map((ruleName) => {
    let rulePath = path.join(rulesDir, ruleName);
    let rule = require(rulePath)[toPascalCase(ruleName)];
    return new rule().lint;
  });

  return plugins;
}
