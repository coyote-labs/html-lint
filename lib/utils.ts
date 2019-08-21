import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import * as cosmiconfig from 'cosmiconfig';

import { BaseRule } from './rules/base-rule';

const rulesDir = path.join(__dirname, 'rules');

export type RuleDetails = {
  name: string,
  isCustomRule: boolean,
  path: string
};

export function toPascalCase(str: string): string {
  let camelised = str.replace(/-([a-z])/g, function (match, word) {
    return word.toUpperCase();
  });

  return camelised.replace(/^./, camelised[0].toUpperCase());
}

export function toKebabCase(str: string): string {
  return str.split(/(?=[A-Z])/).join('-').toLowerCase();
}

export function getRulesList(): Array<RuleDetails> {
  let customRuleNames:Array<string> = [];

  const { config } = (cosmiconfig('html-lint').searchSync() || { config: {} });

  const customRulesDir = config.customRules ? config.customRules.dir : 'html-lint';

  if(config.customRules) {
    customRuleNames =  Object.keys(config.customRules.rules);
  }

  let rules = fs.readdirSync(rulesDir).filter((rule) => {
    return path.extname(rule) === '.js' && !rule.includes('base-rule');
  });

  let allRules = rules.concat(customRuleNames);
  return allRules.map((ruleFile) => {
    let name = path.parse(ruleFile).name;
    let isCustomRule = customRuleNames.includes(ruleFile)
    let rulePath = isCustomRule ?
      path.join(process.cwd(), customRulesDir, name) :
      path.join(rulesDir, name);

    return {
      name,
      isCustomRule,
      path: rulePath
    };
  });
}

export function getRules(): Array<BaseRule> {
  const rules = getRulesList();
  const plugins = rules.map((ruleDetails) => {
    let rule = require(ruleDetails.path)[toPascalCase(ruleDetails.name)];
    return new rule().lint;
  });

  return plugins;
}

export function printUsage() {
  let message = `${chalk.bgRedBright('[html-lint] Invalid arguments passed.')}`;
  let usage = `${chalk.bgCyan(chalk.black('Usage'))} html-lint glob`;
  console.error(message, '\n');
  console.error(usage);
  process.exit(1);
}
