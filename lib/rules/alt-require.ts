import { BaseRule, Options } from './base-rule';

export class AltRequire extends BaseRule {

  constructor(options: any) {
    super({
      name: 'alt-require',
      message: 'alt attribute must be present in <img /> tags',
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.name === 'img' && node.attrs) {
          const { attrs } = node;
          const { alt } = attrs;
          if (!alt) {
            this.violation(node, options);
          }
        }
        if (node.content) {
          this.lint(node.content, options);
        }
      });
    }
    return ast;
  }


}
