const {formatError} = require('../error');

export function doctypeFirst(ast: any, options: any) {
  let ruleMeta = {
    name: 'doctype-first',
    message: 'HTML files should begin with a `doctype`.'
  };

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
        options.runtime.errors.push(formatError(
          ruleMeta,
          options.fileMeta,
          currentNode.location
        ));
      }

      return ast;
    }
  }
}
