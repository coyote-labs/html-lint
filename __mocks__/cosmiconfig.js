'use strict';

const path = require('path');
const fs = require('fs');

let cosmiconfig = jest.genMockFromModule('cosmiconfig');

function searchSync() {
  if(process.env.workingDir) {
    let rcFilePath = path.join(process.env.workingDir, '.html-lintrc');
    if(fs.existsSync(rcFilePath)) {
      let rcContents = fs.readFileSync(rcFilePath).toString();
      return {
        config: JSON.parse(rcContents)
      }
    }
  }
  return {
    config: {}
  }
}

cosmiconfig = function() {
  return { searchSync };
}

module.exports = cosmiconfig;
