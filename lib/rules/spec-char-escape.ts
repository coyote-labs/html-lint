import { BaseRule, Options } from './base-rule';

export class SpecCharEscape extends BaseRule {
  constructor(options: any) {
    super({
      name: 'spec-char-escape',
      message: 'Special characters need to be escaped.',
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.type === 'text') {
          const { content = '' } = node;
          const regex = /[<>&]/g;
          let match;
          while ((match = regex.exec(content)) != null) {
            const nodeCopy = JSON.parse(JSON.stringify(node));
            nodeCopy.location.col = nodeCopy.location.col + match.index;
            this.violation(nodeCopy, options);
          }
        }
  
        if (Array.isArray(node.content)) {
          this.lint(node.content, options);
        }
      });
    }

    return ast;
  }
}
