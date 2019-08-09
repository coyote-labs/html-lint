import BaseRule from './base-rule';

export class IdAdDisabled extends BaseRule {
  constructor() {
    super({
      name: 'id-ad-disabled',
      message: 'IDs should not contain the `ad` keyword to avoid getting flagged by ad blockers.'
    })
  }

  lint = (ast: any, options: any) =>  {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          let {attrs} = node;
          let {id = []} = attrs;
          id = (id[0] || {});

          if (/(^|[-_])ad([-_]|$)/i.test((id.content || ''))) {
            this.error(id, options);
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
