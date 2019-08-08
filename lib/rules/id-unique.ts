const {formatError} = require('../error');

export function idUnique(ast: any, options: any) {
  let ids: any;
  let ruleMeta = {
    name: 'id-unique',
    message: 'IDs should be unique'
  };

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
          options.runtime.errors.push(formatError(
            ruleMeta,
            options.fileMeta,
            id.location,
          ));
        } else {
          ids[id.content] = true;
        }
      }

      if (node.content) {
        idUnique(node.content, options);
      }
    });
  }

  return ast;
}
