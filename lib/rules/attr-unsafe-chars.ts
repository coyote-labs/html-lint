import { BaseRule, Options } from './base-rule';

const regex = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; // eslint-disable-line no-control-regex, no-misleading-character-class

export class AttrUnsafeChars extends BaseRule {
  constructor(options: any) {
    super({
      name: 'attr-unsafe-chars',
      message: 'Attribute values cannot use unsafe characters',
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        const { attrs = {} } = node;
        for (const attribute in attrs) {
          const value = attrs[attribute][0];
          let match;
          while ((match = regex.exec(value.content)) != null) {
            this.violation(value, options);
          }
        }
  
        if (Array.isArray(node.content)) {
          this.lint(node.content, options);
        }
      });
    }

    return ast;
  }
}
