import { BaseRule, Options } from './base-rule';

export class InlineStyleDisabled extends BaseRule {
  constructor(options: any) {
    super({
      name: 'inline-style-disabled',
      message: 'Inline styles should be avoided.',
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          const {attrs} = node;
          const styleAttr = attrs.style || [];
          if (styleAttr.length) {
            const styleNode = styleAttr.find((node: any) => node.type === 'text');
            const style = styleNode.content || '';

            if (style.trim().length) {
              this.violation(styleNode, options);
            }
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
