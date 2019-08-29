const { htmlLint } = require('../index');

(async() => {
  try {
    await htmlLint('tests/sample-*.html');
  } catch (error) {
    console.log(error)
  }
})();
