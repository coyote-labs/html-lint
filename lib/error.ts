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
    return chalk.gray(
      `${ruleMeta.name}: ` + ruleMeta.message) +
      '\n' +
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
    console.error(err)
  }
}

function printTitleForFile(name: string, length: number) {
  console.error(chalk.bgRedBright(`[html-lint] ${length} error${length > 1 ? 's' : ''} in ${name}`));
}

export function printErrors(errors: any) {
  let files = Object.keys(errors);
  files.forEach((file) => {
    let fileErrors = errors[file];
    printTitleForFile(file, fileErrors.length);
    fileErrors.forEach((error: string) => console.error(error, '\n'));
    console.error('\n');
  });
}

export function handleExit(errors: any) {
  let files = Object.keys(errors);
  if (files.length) {
    throw new Error(chalk.red('html-lint failed.'));
  }
}
