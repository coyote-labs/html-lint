const chalk = require('chalk');
const { codeFrameColumns } = require('@babel/code-frame');

export type location = {
  line: number,
  col: number,
  outerHTML: string,
  innerHTML: string
};

export type fileMeta = {
  name: string,
  contents: string
};

export type ruleMeta = {
  name: string,
  message: string
};

export function formatError(
  ruleMeta: ruleMeta,
  fileMeta: fileMeta,
  location: location
) {
  try {
    return `${chalk.bgRed('[html-lint] error')} in ${fileMeta.name}` +
      chalk.gray(`(${ruleMeta.name})`) +
      '\n\n' +
      codeFrameColumns(fileMeta.contents, {
      start: {
        line: location.line,
        column: location.col
      }
    }, {
      message: ruleMeta.message,
      highlightCode: true
    });
  } catch(err) {
    console.log(err)
  }
}
