// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require('chalk');
import { codeFrameColumns } from '@babel/code-frame';

export type location = {
  line: number;
  col: number;
  outerHTML: string;
  innerHTML: string;
};

export type fileMeta = {
  name: string;
  contents: string;
};

export type ruleMeta = {
  name: string;
  message: string;
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
          highlightCode: true,
          forceColor: true
        }
      );
  } catch(err) {
    console.error(err);
    return '';
  }
}

function printTitleForFile(name: string, length: number, level: string): void {
  const isError = level === 'error';
  const color = isError ? chalk.bgRedBright : chalk.bgYellow;
  const text = `[html-lint] ${length} ${level}${length > 1 ? 's' : ''} in ${name}`;
  const message = isError ? text : chalk.black(text);
  const printToConsole = isError ? console.error : console.warn;

  printToConsole(color(message));
}

interface ErrorLevelMapping {
  [index: string]: string;
}

const errorLevelMap: ErrorLevelMapping = {
  error: 'errors',
  warn: 'warnings',
  off: 'ignored',
}

export function processFileLevelConfig(
  { violations, htmlLintConfig }: { violations: any; htmlLintConfig: any }
): void {
  const files = Object.keys(violations || []);
  files.forEach((file) => {
    const fileViolations = violations[file];

    const fileLevelConfig = htmlLintConfig[file] || {};
    Object.keys(fileLevelConfig).forEach((rule: string) => {
      const errorLevel = fileLevelConfig[rule];

      // Find the other possible values.
      // For example, if the `errorLevel` is `error`, the other two possible values are
      // `warn` and `off`.
      let remainingErrorLevels = ['error', 'warn', 'off'].filter(level => level !== errorLevel);
      remainingErrorLevels = remainingErrorLevels.map((level: any) => {
        return errorLevelMap[level];
      })

      // Get level wise violations for this file
      const currentErrorLevel = errorLevelMap[errorLevel];
      const [levelA, levelB] = remainingErrorLevels;
      const violationsForLevelA = fileViolations[levelA];
      const violationsForLevelB = fileViolations[levelB];

      // Get only violations that are due to the current `rule`.
      // We are using `.includes` instead of `.startsWith` as the messages would have ANSI
      // codes due to us adding colors to the messages.
      const matchingLevelA = violationsForLevelA.filter((message: string) => message.includes(rule)) || [];
      const matchingLevelB = violationsForLevelB.filter((message: string) => message.includes(rule)) || [];

      // Combine the matching violations with the already existing violations in the corresponding level.
      const violationsForCurrentLevel = fileViolations[currentErrorLevel] || [];
      fileViolations[currentErrorLevel] = [
        ...matchingLevelA,
        ...matchingLevelB,
        ...violationsForCurrentLevel
      ];

      // Remove the violations from their original category
      fileViolations[levelA] = violationsForLevelA.filter((message: string) => !message.includes(rule)) || [];
      fileViolations[levelB] = violationsForLevelB.filter((message: string) => !message.includes(rule)) || [];
    });
  });
}

export function printViolations(
  { violations }: { violations: any }
): void {
  const files = Object.keys(violations || {});
  files.forEach((file) => {
    const fileViolations = violations[file];

    const fileErrors = fileViolations.errors;
    if (fileErrors.length) {
      printTitleForFile(file, fileErrors.length, 'error');
      fileErrors.forEach((error: string) => console.error(error, '\n'));
      console.error('\n');
    }

    const fileWarnings = fileViolations.warnings;
    if (fileWarnings.length) {
      printTitleForFile(file, fileWarnings.length, 'warning');
      fileWarnings.forEach((warning: string) => console.warn(warning, '\n'));
      console.warn('\n');
    }
  });
}

export function handleExit(
  { violations }: { violations: any },
  pool: any
): void {
  const files: Array<string> = Object.keys(violations || {});
  const shouldThrow: boolean = files.reduce((accummulator: boolean, file: string) => {
    if (violations[file].errors.length) {
      return true;
    }

    return accummulator || false;
  }, false);

  if (pool) {
    pool.terminate();
  }

  if (shouldThrow) {
    throw new Error(chalk.red('html-lint failed.'));
  }
}

export function report(runTimeArgs: any, pool: any): void {
  processFileLevelConfig(runTimeArgs);
  printViolations(runTimeArgs);
  handleExit(runTimeArgs, pool);
}
