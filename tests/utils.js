const fs = require('fs');

function getFileMeta(fixture) {
  return {
    contents: fs.readFileSync(`./tests/rules/${fixture}`).toString(),
    name: fixture
  };
}

module.exports = { getFileMeta };
