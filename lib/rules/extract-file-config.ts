import { BaseRule, Options, ErrorLevel } from './base-rule';

export class ExtractFileConfig extends BaseRule {
  constructor() {
    super({
      name: '_extract-file-config',
      message: 'This is not a rule.'
    })
  }

  lint = (ast: any, options: Options) =>  {
    let fileName = options.fileMeta.name;

    if (Array.isArray(ast)) {
      for (let i = 0; i < ast.length; i++) {
        let currentNode = ast[i];
        let currentNodeType = currentNode.type;
        if (currentNodeType === 'comment') {
          let { content = '' } = currentNode;
          if (content.includes('html-lint')) {
            let rawConfig = content.replace('html-lint', '').trim();
            let configPairs = rawConfig.split(',').map((pair: string) => pair.trim());
            configPairs.forEach((pair: string) => {
              let keyValuePair = pair.split(':').map((pair: string) => pair.trim());
              let key = keyValuePair[0];
              let value = keyValuePair[1] as ErrorLevel;

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
