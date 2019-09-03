import { BaseRule, Options } from './base-rule';

const srcTags = [
  'audio',
  'embed',
  'iframe',
  'img',
  'input',
  'source',
  'track',
  'video'
];

export class SrcNotEmpty extends BaseRule {
  constructor(options: any) {
    super({
      name: 'src-not-empty',
      message: 'src attribute should not be empty.'
    }, options);
  }

  lint = (ast: any, options: Options): any => {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if(srcTags.includes(node.name)) {
          if (node.attrs) {
            const { attrs } = node;
            let { src = [], type = [] } = attrs;
            src = src[0];
            type = type[0]
            if(!src || !src.content) {
              /*
               For only input tags which is of type image,
               we have to show error if src attribute is empty.
              */
              if(node.name === 'input' && type && type.content !== 'image') {
                return;
              }
              this.violation(src || node, options);
            }
          } else {
            this.violation(node, options);
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
