import { BaseRule, Options } from './base-rule';

export class HeadScriptDisabled extends BaseRule {
  constructor(options: any) {
    super({
      name: 'head-script-disabled',
      message: 'Avoid using <script> tags in <head> without the `defer` or `async` attributes.'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    let html;
    let head;

    if (Array.isArray(ast)) {
      html = ast.find((node: any) => node.name === 'html') || [];
      head = (html.content || []).find((node: any) => node.name === 'head') || {};
      if (Array.isArray(head.content)) {
        const scripts = head.content.filter((node: any) => node.name === 'script');
        scripts.forEach((script: any) => {
          const {attrs = {}} = script;
          const attributes = Object.keys(attrs);

          if (!attributes.length) {
            this.violation(script, options);
          } else {
            if (
              !attributes.includes('defer') &&
              !attributes.includes('async')
            ) {
              this.violation(script, options);
            }
          }
        });
      }
    }

    return ast;
  }
}
