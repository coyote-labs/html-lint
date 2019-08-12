const chalk = require('chalk');
import { codeFrameColumns } from '@babel/code-frame';

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

export function formatViolation(
  ruleMeta: ruleMeta,
  fileMeta: fileMeta,
  location: location
): string {
  try {
    return chalk.gray(
      `${ruleMeta.name}: ` + ruleMeta.message
      ) +
      '\n' +
      codeFrameColumns(
        fileMeta.contents, {
          start: {
            line: location.line,
            column: location.col
          }
        }, {
          message: ruleMeta.message,
          highlightCode: true
        }
      );
  } catch(err) {
    console.error(err);
    return '';
  }
}

function printTitleForFile(name: string, length: number, level: string) {
  let isError = level === 'error';
  let color = isError ? chalk.bgRedBright : chalk.bgYellow;
  let printToConsole = isError ? console.error : console.warn;

  printToConsole(color(`[html-lint] ${length} ${level}${length > 1 ? 's' : ''} in ${name}`));
}

export function printViolations(violations: any) {
  let files = Object.keys(violations);
  files.forEach((file) => {
    let fileViolations = violations[file];

    let fileErrors = fileViolations.errors;
    if (fileErrors.length) {
      printTitleForFile(file, fileErrors.length, 'error');
      fileErrors.forEach((error: string) => console.error(error, '\n'));
      console.error('\n');
    }

    let fileWarnings = fileViolations.warnings;
    if (fileWarnings.length) {
      printTitleForFile(file, fileWarnings.length, 'warning');
      fileWarnings.forEach((warning: string) => console.warn(warning, '\n'));
      console.warn('\n');
    }
  });
}

export function handleExit(violations: any) {
  let files: Array<string> = Object.keys(violations);
  let shouldThrow: boolean = files.reduce((accummulator: boolean, file: string) => {
    if (violations[file].errors.length) {
      return true;
    }

    return accummulator || false;
  }, false);
  if (shouldThrow) {
    throw new Error(chalk.red('html-lint failed.'));
  }
}
