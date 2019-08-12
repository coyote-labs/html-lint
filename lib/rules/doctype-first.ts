import { BaseRule, Options } from './base-rule';

export class DoctypeFirst extends BaseRule {
  constructor() {
    super({
      name: 'doctype-first',
      message: 'HTML files should begin with a `doctype`.'
    })
  }

  lint = (ast: any, options: Options) =>  {
    if (Array.isArray(ast)) {
      let skippableTypes = [
        'comment',
        'text'
      ];

      for (let i = 0; i < ast.length; i++) {
        let currentNode = ast[i];
        let currentNodeType = currentNode.type;
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
