module.exports =  {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended'
  ],
  plugins: [
   'jest'
  ],
  env: {
    node: true,
    'jest/globals': true
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
    }
  ]
};
