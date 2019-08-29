import { BaseRule, Options } from './base-rule';

export class SrcNotEmpty extends BaseRule {
  constructor(options: any) {
    super({
      name: 'src-not-empty',
      message: 'src attribute should not be empty.'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          const { attrs } = node;
          let { src = [] } = attrs;
          src = src[0];
          if(node.name === 'img' && (!src || !src.content)) {
            this.violation(src || node, options);
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
