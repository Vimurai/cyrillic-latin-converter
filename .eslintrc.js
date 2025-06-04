module.exports = {
  root: true,
  env: {
    es2021: true,   // Enables ES2021 globals (Promise, etc.)
    node: true,     // Enables Node.js global variables and Node scoping
    browser: true   // Enables browser globals (window, document, etc.)
  },
  parserOptions: {
    ecmaVersion: 12,    // Support for modern ECMAScript features (ES2021)
    sourceType: 'module' // Enable ES Modules (import/export)
  },
  extends: [
    'eslint:recommended',        // Use ESLint’s recommended rules
    'plugin:prettier/recommended' // Integrate Prettier (turns off formatting rules that conflict with Prettier)
  ],
  plugins: ['prettier'],
  rules: {
    // Treat Prettier formatting issues as lint errors
    'prettier/prettier': 'error',

    // Allow console statements (set to 'warn' or 'error' if you want to forbid console.log)
    'no-console': 'off',

    // Warn about unused variables (ignore function args that start with an underscore)
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Enforce semicolons at the end of statements
    'semi': ['error', 'always'],

    // Enforce single quotes for strings (allow backticks when needed)
    'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

    // Disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'error',

    // Enforce consistent 2-space indentation (case clauses in switch are indented once)
    'indent': ['error', 2, { SwitchCase: 1 }],

    // Disallow duplicate imports
    'no-duplicate-imports': 'error',

    // Disallow use of undeclared variables
    'no-undef': 'error'
  }
};
