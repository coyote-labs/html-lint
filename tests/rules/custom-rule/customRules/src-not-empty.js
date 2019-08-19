const { BaseRule } = require('html-lint/dist/rules/base-rule')

class SrcNotEmpty extends BaseRule {
  constructor() {
    super({
      name: 'src-not-empty',
      message: 'Src attribute should not be empty.'
    });

    this.lint = (ast, options) => {
      if (Array.isArray(ast)) {
        ast.forEach((node) => {
          if (node.attrs) {
            let { attrs } = node;
            let { src = [] } = attrs;
            src = src[0];
            if(node.name === 'img' && !src.content) {
              this.violation(src, options);
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
}

module.exports = {
  SrcNotEmpty
}
