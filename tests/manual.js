const lint = require('../index');

(async() => {
  try {
    process.env['class-ad-disabled'] = 'off';
    process.env['id-ad-disabled'] = 'off';
    process.env['doctype-first'] = 'warn';
    process.env['id-unique'] = 'warn';
    await lint('tests/sample-*.html');
  } catch (error) {
    console.log(error)
  }
})();
