# Extending

### Configuring Custom Rules

You can use you own custom rules along with html-lint. To do so, you will have to
configure html-lint as follows:

```js
// .html-lintrc
{
  'custom-rules': {
    'dir': 'directory containing custom rules',
    'rules': {                  // list of rules that you would like to add
      'custom-rule-one': 'warn' // one of 'on', 'warn' and 'off'
    }
  }
}
```


### Writing Custom Rules

* Needs to be a class that extends [`BaseRule`](https://github.com/coyote-labs/html-lint/blob/master/lib/rules/base-rule.ts).
  ```js
    const { BaseRule } = require('@coyote-labs/html-lint/dist/rules/base-rule');
  ```
* In the `constructor`, invoke `super` with two arguments.
  * An object containing the name of the rule and the message that has to be displayed
    when the rule is violated.
  * Pass `options` as the second parameter.
  ```js
    constructor(options) {
      let meta = {
        name: 'custom-rule-one',
        message: 'message to be displayed'
      };

      super(meta, options);
    }
  ```
* Define the rule in the `lint` method. It receives two arguments:
  * `ast`, an object containing the current node.
  * `options`, an object containing html-lint configurations.
  ```js
    this.lint = (ast, options) => {
      if (Array.isArray(ast)) {
        ast.forEach((node) => {

          // Rule Implementation

          // recursively call `lint` for child nodes if needed
          if (node.content) {
            this.lint(node.content, options);
          }
        });
      }

      return ast; // `lint` should always return the ast
    }
  ```
* In the `lint` function, you can call the `violation` method to log violations. It takes
  two arguments:
  * The `node` that you would like to be highlighted in the log.
  * `options`, an object containing html-lint configurations.
  ```js
    this.violation(node, options);
  ```

### Example

Here's an example,

``` js
const { BaseRule } = require('@coyote-labs/html-lint/dist/rules/base-rule')

// the class name should be the pascal case form of the file name.
class CustomRuleOne extends BaseRule {
  constructor() {
    super({
      name: 'custom-rule-one',
      message: 'message to be displayed'
    });

    this.lint = (ast, options) => {
      if (Array.isArray(ast)) {
        ast.forEach((node) => {

          // Actual rule implementation
          if (node.name === 'P') {
            this.violation(node, options); // logs if <p> tag is in uppercase.
          }

          // recursively call `lint` for child nodes if needed
          if (node.content) {
            this.lint(node.content, options);
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

It is important to remember that these custom rules are essentially just [reshape](https://github.com/reshape/reshape) plugins.
Please refer to [reshape's documentation](https://github.com/reshape/reshape#writing-a-plugin) to learn more about writing plugins.

You can also take a look at the [`src-not-empty` custom rule
test](https://github.com/coyote-labs/html-lint/blob/master/tests/e2e/custom-rule/customRules/src-not-empty.js) in our repo for a 
more detailed example.
