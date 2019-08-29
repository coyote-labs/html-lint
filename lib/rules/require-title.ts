import { BaseRule, Options } from './base-rule';

export class RequireTitle extends BaseRule {
  constructor(options: any) {
    super({
      name: 'require-title',
      message: '<title> must be present in the <head> tag'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    let shouldError = true;
    let html;
    let head;

    if (Array.isArray(ast)) {
      html = ast.find((node: any) => node.name === 'html') || [];
      head = (html.content || []).find((node: any) => node.name === 'head') || {};

      const titleNode = (head.content || []).find((node: any) => node.name === 'title') || {};
      const titleText = (titleNode.content || []).find((node: any) => node.type === 'text') || {};
      const title = titleText.content || '';

      shouldError = !title.trim().length;
    }

    if (shouldError) {
      const node = head.location ? head : html;
      this.violation(node, options);
    }

    return ast;
  }
}
