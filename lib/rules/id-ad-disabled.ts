import { BaseRule, Options } from './base-rule';

export class IdAdDisabled extends BaseRule {
  constructor() {
    super({
      name: 'id-ad-disabled',
      message: 'IDs should not contain `ad(s)` or `sponsor(s)` to avoid getting flagged by ad blockers.'
    })
  }

  lint = (ast: any, options: Options) =>  {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          let {attrs} = node;
          let {id = []} = attrs;
          id = (id[0] || {});

          if (/(^|[-_])(ad?|sponsors?)([-_]|$)/i.test((id.content || ''))) {
            this.violation(id, options);
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
