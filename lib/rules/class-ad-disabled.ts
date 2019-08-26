import { BaseRule, Options } from './base-rule';

export class ClassAdDisabled extends BaseRule {
  constructor(options: any) {
    super({
      name: 'class-ad-disabled',
      message: 'Class names should not contain `ad(s)` or `sponsor(s)` to avoid getting flagged by ad blockers.',
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          const {attrs} = node;
          let classAttr = attrs.class || [];
          classAttr = classAttr[0] || {};
          const classNames = (classAttr.content || '').split(' ');
          if (classNames.length) {
            classNames.forEach((className: string) => {
              if (
                /(^|[-_])(ads?|sponsors?)([-_]|$)/i.test(className)
              ) {
                this.violation(classAttr, options);
              }
            });
          }
        }
  
        if (node.content) {
          this.lint(node.content, options);
        }
      });
    }

    return ast;
  }
}
