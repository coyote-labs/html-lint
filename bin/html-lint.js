#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2));
const { htmlLint } = require('../index');

(async() => {
  // When invoked as `html-lint **/*.html`, argv will already have the
  // glob matches.
  let htmlFiles = args._;
  if (!htmlFiles.length) {
    htmlFiles = '**/*.html';
  }

  try {
    await htmlLint(htmlFiles);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
