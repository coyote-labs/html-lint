const reshape = require('reshape');

const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <P>wow</P>
      <main>
        <div>
        </div>
      </main>
    </body>
  </html>
`;

function linter(ast, { PluginError }) {
  if (Array.isArray(ast)) {
    ast.forEach(node => {
      if (node.type === 'tag') {
        let tagName = node.name;
        // TODO handle whitespace
        if (!node.location.outerHTML.startsWith(`<${tagName}>`)) {
          // TODO write custom wrapper
          throw new PluginError({
            plugin: 'HTML Linter',
            message: 'Tags should be in lowercase',
            location: node.location
          });
        }
      }
  
      if (node.content) {
        linter(node.content, {PluginError});
      }
    });
  }

  return ast;
}

(async() => {
  try {
    await reshape({ plugins: linter, filename: 'test.html' })
    .process(html);
  } catch({ message }) {
    console.error(message)
  }
})();
