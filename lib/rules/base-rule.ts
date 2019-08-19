import { formatViolation } from '../error';
import * as cosmiconfig from 'cosmiconfig';

import { getRulesList } from "../utils";

export type ErrorLevel = 'off' | 'warn' | 'error';

export type RuleMeta = {
  name: string,
  message: string,
  level?: ErrorLevel
};

export type FileMeta = {
  name: string,
  contents: string
};

export interface Options {
  runtime: {
    violations: {
      [index: string]: {
        errors: Array<string>,
        warnings: Array<string>,
        ignored: Array<string>
      }
    },
    htmlLintConfig: {
      // fileName: { rule: value }
      [index: string]: {
        [index: string]: ErrorLevel
      }
    }
  },
  idsPresent: {},
  fileMeta: FileMeta,
};

export interface Config {
  [index: string]: ErrorLevel
}

declare var process : {
  env: {
    [index: string]: ErrorLevel
  }
}

function getConfigFromEnv(rule: string): ErrorLevel {
  return process.env[rule];
}

// load project level configuration
let { config } = (cosmiconfig('html-lint').searchSync() || { config: {} });
let { customRules = {} } = config;
let defaultErrorLevel: ErrorLevel = 'error';
let defaultConfig: Config = {};

let rules = getRulesList();
rules.forEach((rule) => {
  let { name } = rule;
  defaultConfig[name] = defaultErrorLevel;

  let configInEnv = getConfigFromEnv(name);
  if (configInEnv) {
    defaultConfig[name] = configInEnv;
  }
});

config = Object.assign(defaultConfig, config, customRules.rules);

export class BaseRule {
  ruleMeta: RuleMeta;

  constructor(meta: RuleMeta) {
    this.ruleMeta = Object.assign({
      level: config[meta.name]
    }, meta);
  }

  getErrorLevel = (): ErrorLevel => {
    return this.ruleMeta.level || 'error';
  }

  shouldError = () => {
    return this.getErrorLevel() === 'error';
  }

  shouldWarn = () => {
    return this.getErrorLevel() === 'warn';
  }

  shouldIgnore = () => {
    return this.getErrorLevel() === 'off';
  }

  lint = (ast: any, options: Options) => {
    return ast;
  }

  _getFormattedViolation = (node: any, options: Options): string => {
    return formatViolation(
      this.ruleMeta,
      options.fileMeta,
      node.location
    );
  }

  violation = (node: any, options: Options) => {
    let fileName = options.fileMeta.name;

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
