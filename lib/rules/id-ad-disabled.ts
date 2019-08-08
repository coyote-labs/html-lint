const {formatError} = require('../error');

export function idAdDisabled(ast: any, options: any) {
  let ruleMeta = {
    name: 'id-ad-disabled',
    message: 'IDs should not contain the `ad` keyword to avoid getting flagged by ad blockers.'
  };

  if (Array.isArray(ast)) {
    ast.forEach((node) => {
      if (node.attrs) {
        let {attrs} = node;
        let {id = []} = attrs;
        id = (id[0] || {});

        if (/(^|[-_])ad([-_]|$)/i.test((id.content || ''))) {
          options.runtime.errors.push(formatError(
            ruleMeta,
            options.fileMeta,
            id.location
          ));
        }
      }

      if (node.content) {
        idAdDisabled(node.content, options);
      }
    });
  }

  return ast;
}
