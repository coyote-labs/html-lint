import { BaseRule, Options } from './base-rule';

export class IdUnique extends BaseRule {
  constructor() {
    super({
      name: 'id-unique',
      message: 'IDs should be unique'
    })
  }

  lint = (ast: any, options: Options) =>  {
    let ids: any;
    if (!options['idsPresent']) {
      options.idsPresent = {};
      ids = {};
    } else {
      ids = options.idsPresent
    }

    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          let {attrs} = node;
          let {id = []} = attrs;
          id = (id[0] || {});

          if (ids[id.content]) {
            this.error(id, options);
          } else {
            ids[id.content] = true;
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
