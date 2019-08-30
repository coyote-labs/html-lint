# Extending

### Custom Rules Configuration

In your configuration file, you have to specify,
  * directory where your custom rules resides
  * rules list with its error level.

***Example:***
```js
{
  'custom-rules': {
    'dir': 'my-custom-rules',
    'rules': {
      'custom-rule-one': 'error',
    }
  }
}
```
### Writing custom rules

while writing custom rules,

  * Write a class which extends [`BaseRule`](https://github.com/coyote-labs/html-lint/blob/master/lib/rules/base-rule.ts)

  ```js
    const { BaseRule } = require('html-lint/dist/rules/base-rule')
  ```

  * In constructor, call super with two arguments
    - `name`: custom rule name
    - `message`: message to be displayed when custom rule fails.

    ```js
      constructor() {
        super({
          name: 'custom-rule-one',
          message: 'message to be displayed'
        });
      }
    ```

  * Override, lint method inside constructor itself.
  * lint method gets two arguments
    - `ast`: ast of the current node
    - `options`: option will have the configurations of html-lint

  ```js
    this.lint = (ast, options) => {
      if (Array.isArray(ast)) {
        ast.forEach((node) => {

          if (node.content) {
            this.lint(node.content, options); // call recursively for child elements
          }
        });
      }
      return ast; // should return ast
    }
  ```

  * In lint function, if you want print error message call `violation` method with
    - current node
    - options, which is an second argument of lint method


  ```js
    this.violation(node, options);
  ```

----
Finally the custom rule file looks like,

``` js
const { BaseRule } = require('html-lint/dist/rules/base-rule')

class CustomRuleOne extends BaseRule {
  constructor() {
    super({
      name: 'custom-rule-one',
      message: 'message to be displayed'
    });

    this.lint = (ast, options) => {
      if (Array.isArray(ast)) {
        ast.forEach((node) => {
          if(node.name === 'P') {
            this.violation(node, options); // prints message if <p> tag is in uppercase.
          }
          if (node.content) {
            this.lint(node.content, options); // call recursively for child elements
          }
        });
      }
      return ast; // should return ast
    }
  }
}

module.exports = {
  CustomRuleOne
}
```

You can take example `src-not-empty` custom rule [here](https://github.com/coyote-labs/html-lint/blob/master/tests/e2e/custom-rule/customRules/src-not-empty.js)
