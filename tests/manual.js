const { htmlLint } = require('../index');

(async() => {
  try {
    await htmlLint('tests/sample-a.html');
  } catch (error) {
    console.log(error)
  }
})();
