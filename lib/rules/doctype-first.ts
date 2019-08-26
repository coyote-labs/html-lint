import { BaseRule, Options } from './base-rule';

export class DoctypeFirst extends BaseRule {
  constructor(options: any) {
    super({
      name: 'doctype-first',
      message: 'HTML files should begin with a `doctype`.'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      const skippableTypes = [
        'comment',
        'text'
      ];

      for (let i = 0; i < ast.length; i++) {
        const currentNode = ast[i];
        const currentNodeType = currentNode.type;
        if (currentNodeType === 'doctype') {
          return ast;
        }

        if (!skippableTypes.includes(currentNodeType)) {
          this.violation(currentNode, options);
        }

      }
    }
    return ast;
  }
}
