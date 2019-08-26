module.exports =  {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended'
  ],
  env: {
    node: true
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@typescript-eslint/recommended'],
    }
  ]
};
