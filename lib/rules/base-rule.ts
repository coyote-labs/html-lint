const {formatError} = require('../error');

export default class BaseRule {
  ruleMeta: any;

  constructor(meta: any) {
    this.ruleMeta = {
      name: meta.name,
      message: meta.message
    };
  }

  lint = (ast: any, options: any)  => {
    return ast;
  }

  public error(node: any, options: any) {
    options.runtime.errors.push(formatError(
      this.ruleMeta,
      options.fileMeta,
      node.location
    ));
  }
}
