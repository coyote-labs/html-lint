const {formatError} = require('../error');

export type RuleMeta = {
  name: string,
  message: string
};

export type FileMeta = {
  name: string,
  contents: string
};

export interface Options {
  runtime: {
    errors: {
      [index: string]: Array<string>
    },
  },
  idsPresent: {},
  fileMeta: FileMeta,
};

export class BaseRule {
  ruleMeta: RuleMeta;

  constructor(meta: RuleMeta) {
    this.ruleMeta = Object.assign({}, meta);
  }

  lint = (ast: any, options: Options) => {
    return ast;
  }

  _getFormattedError = (node: any, options: Options): string => {
    return formatError(
      this.ruleMeta,
      options.fileMeta,
      node.location
    );
  } 

  error = (node: any, options: Options) => {
    let fileName = options.fileMeta.name;
    let errorsForFile = options.runtime.errors[fileName];
    if (errorsForFile) {
      errorsForFile.push(this._getFormattedError(node, options));
    } else {
      options.runtime.errors[fileName] = [
        this._getFormattedError(node, options)
      ]
    }
  }
}
