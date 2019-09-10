const fs = require('fs');

let content = fs.readFileSync('./docs/README.md').toString();

content = content.replace('./_media/demo.png', 'result.png');

fs.writeFileSync('./README.md', content);
