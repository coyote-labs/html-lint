import { BaseRule, Options, ErrorLevel } from './base-rule';

export class ExtractFileConfig extends BaseRule {
  constructor() {
    super({
      name: '_extract-file-config',
      message: 'This is not a rule.'
    })
  }

  lint = (ast: any, options: Options): any => {
    const fileName = options.fileMeta.name;

    if (Array.isArray(ast)) {
      for (let i = 0; i < ast.length; i++) {
        const currentNode = ast[i];
        const currentNodeType = currentNode.type;
        if (currentNodeType === 'comment') {
          const { content = '' } = currentNode;
          if (content.includes('html-lint')) {
            const rawConfig = content.replace('html-lint', '').trim();
            const configPairs = rawConfig.split(',').map((pair: string) => pair.trim());
            configPairs.forEach((pair: string) => {
              const keyValuePair = pair.split(':').map((pair: string) => pair.trim());
              const key = keyValuePair[0];
              const value = keyValuePair[1] as ErrorLevel;

              let fileConfig = options.runtime.htmlLintConfig[fileName];
              if (!fileConfig) {
                options.runtime.htmlLintConfig[fileName] = {};
                fileConfig = options.runtime.htmlLintConfig[fileName];
              }

              fileConfig[key] = value;
            });
          }
        }
      }
    }

    return ast;
  }
}
