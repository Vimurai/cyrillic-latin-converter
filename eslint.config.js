
export default [
  {
    // 1) All .js files:
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',    // allow modern ES syntax
      sourceType: 'module'      // enable import/export
    },
    rules: {
      // You can add any JS‐specific ESLint rules here. For example:
      // enforce semicolons:
      'semi': ['error', 'always'],
      // no trailing spaces at end of lines:
      'no-trailing-spaces': 'error',
      // 2‐space indentation:
      'indent': ['error', 2, { SwitchCase: 1 }],
      // do not allow undefined variables:
      'no-undef': 'error',
      // warn on unused variables, but allow args named _foo:
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // allow console.log (change to "warn" or "error" if you want to forbid):
      'no-console': 'off',
      // prevent duplicate imports:
      'no-duplicate-imports': 'error'
    }
  },

];
