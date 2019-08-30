import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import * as cosmiconfig from 'cosmiconfig';

import { BaseRule } from './rules/base-rule';

const rulesDir = path.join(__dirname, 'rules');

export type RuleDetails = {
  name: string;
  isCustomRule: boolean;
  path: string;
};

export function toPascalCase(str: string): string {
  const camelised = str.replace(/-([a-z])/g, function (match, word) {
    return word.toUpperCase();
  });

  return camelised.replace(/^./, camelised[0].toUpperCase());
}

export function toKebabCase(str: string): string {
  return str.split(/(?=[A-Z])/).join('-').toLowerCase();
}

export function getRulesList(configPath: string): Array<RuleDetails> {
  let customRuleNames: Array<string> = [];

  const { config } = (cosmiconfig('html-lint').searchSync(configPath) || { config: {} });
  const customRulesDir = config.customRules ? config.customRules.dir : 'html-lint';

  if (config.customRules) {
    customRuleNames =  Object.keys(config.customRules.rules);
  }

  const rules = fs.readdirSync(rulesDir).filter((rule) => {
    return path.extname(rule) === '.js' && !rule.includes('base-rule');
  });

  const allRules = rules.concat(customRuleNames);
  return allRules.map((ruleFile) => {
    const name = path.parse(ruleFile).name;
    const isCustomRule = customRuleNames.includes(ruleFile)
    const rulePath = isCustomRule ?
      path.join(process.cwd(), customRulesDir, name) :
      path.join(rulesDir, name);

    return {
      name,
      isCustomRule,
      path: rulePath
    };
  });
}

export function getRules(runTimeArgs: any): Array<BaseRule> {
  const configPath = runTimeArgs.configPath;
  const rules = getRulesList(configPath);
  const plugins = rules.map((ruleDetails) => {
    const rule = require(ruleDetails.path)[toPascalCase(ruleDetails.name)];
    return new rule(configPath).lint;
  });

  return plugins;
}

export function printUsage(): void {
  const message = `${chalk.bgRedBright('[html-lint] Invalid arguments passed.')}`;
  const usage = `${chalk.bgCyan(chalk.black('Usage'))} html-lint glob`;
  console.error(message, '\n');
  console.error(usage);
  process.exit(1);
}

export function deepClone(object: any): any {
  return JSON.parse(JSON.stringify(object));
}
