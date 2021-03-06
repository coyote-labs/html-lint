import { BaseRule, Options } from './base-rule';

export class IdUnique extends BaseRule {
  constructor(options: any) {
    super({
      name: 'id-unique',
      message: 'IDs should be unique'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
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
          const {attrs} = node;
          let {id} = attrs;
          if (Array.isArray(id)) {
            id = id[0];
            if (id) {
              if (ids[id.content]) {
                this.violation(id, options);
              } else {
                ids[id.content] = true;
              }
            }
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
