import { BaseRule, Options } from './base-rule';

export class AttrNoDuplication extends BaseRule {
  constructor(options: any) {
    super({
      name: 'attr-no-duplication',
      message: 'Attributes should not be duplicated.'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        const { attrs = {} } = node;
        const attributes = Object.keys(attrs) || [];
        if (attributes.length) {
          // Since reshape provides ignores the duplicated instance of the
          // attribute, this rule tries and provides linting on a best effort basis.
          // The error location in the trace might be a few columns off as a result.
          const tagContents = (node.location.outerHTML || '').replace(node.location.innerHTML || '');
          attributes.forEach((attribute) => {
            const attributeMatches = (tagContents.match(new RegExp(`${attribute}\\s*=`, 'g')) || []);
            if (attributeMatches.length > 1) {
              const duplicateAttr = (attrs[attribute] || [])[0];
              this.violation(duplicateAttr, options);
            }
          });
        }

        if (node.content) {
          this.lint(node.content, options);
        }
      });
    }
    return ast;
  }
}
