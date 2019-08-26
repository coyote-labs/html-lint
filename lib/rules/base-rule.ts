import { formatViolation } from '../error';
import * as cosmiconfig from 'cosmiconfig';

import { getRulesList } from "../utils";

export type ErrorLevel = 'off' | 'warn' | 'error';

export type RuleMeta = {
  name: string;
  message: string;
  level?: ErrorLevel;
};

export type FileMeta = {
  name: string;
  contents: string;
};

export interface Options {
  runtime: {
    violations: {
      [index: string]: {
        errors: Array<string>;
        warnings: Array<string>;
        ignored: Array<string>;
      };
    };
    htmlLintConfig: {
      // fileName: { rule: value }
      [index: string]: {
        [index: string]: ErrorLevel;
      };
    };
    configPath: string;
  };
  idsPresent: {};
  fileMeta: FileMeta;
}

export interface Config {
  [index: string]: ErrorLevel;
}

declare let process: {
  env: {
    [index: string]: ErrorLevel;
  };
  cwd: Function;
}

export class BaseRule {
  ruleMeta: RuleMeta;

  constructor(meta: RuleMeta, configPath: string = process.cwd()) {
    // load project level configuration
    let { config } = (cosmiconfig('html-lint').searchSync(configPath) || { config: {} });
    const { customRules = {} } = config;
    const defaultErrorLevel: ErrorLevel = 'error';
    const defaultConfig: Config = {};

    const rules = getRulesList(configPath);
    rules.forEach((rule) => {
      const { name } = rule;
      defaultConfig[name] = defaultErrorLevel;
    });

    config = Object.assign(defaultConfig, config, customRules.rules);
    this.ruleMeta = Object.assign({
      level: config[meta.name]
    }, meta);
  }

  getErrorLevel = (): ErrorLevel => {
    return this.ruleMeta.level || 'error';
  }

  shouldError = (): boolean => {
    return this.getErrorLevel() === 'error';
  }

  shouldWarn = (): boolean => {
    return this.getErrorLevel() === 'warn';
  }

  shouldIgnore = (): boolean => {
    return this.getErrorLevel() === 'off';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lint = (ast: any, options: Options): any => {
    return ast;
  }

  _getFormattedViolation = (node: any, options: Options): string => {
    return formatViolation(
      this.ruleMeta,
      options.fileMeta,
      node.location
    );
  }

  violation = (node: any, options: Options): void => {
    const fileName = options.fileMeta.name;

    let violationsForFile = options.runtime.violations[fileName];
    if (!violationsForFile) {
      options.runtime.violations[fileName] = {
        errors: [],
        warnings: [],
        ignored: []
      };
      violationsForFile = options.runtime.violations[fileName];
    }

    let violations;
    if (this.shouldIgnore()) {
      violations = violationsForFile.ignored;
    } else {
      violations = this.shouldError() ?
        violationsForFile.errors :
        violationsForFile.warnings;
    }

    violations.push(this._getFormattedViolation(node, options));
  }
}
