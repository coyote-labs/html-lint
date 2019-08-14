const fs = require('fs');

function getFileMeta(fixture) {
  return {
    contents: fs.readFileSync(`./tests/${fixture}`).toString(),
    name: fixture
  };
}

module.exports = { getFileMeta };
