const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');

module.exports = [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'node_modules/**',
      '**/*.spec.ts',
      'eslint.config.js',
      'karma.conf.js',
      'src/index.html',
      'src/**/*.html',
      'scripts/coverage-check.js'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module'
    },
    plugins: {
      '@angular-eslint': angularPlugin
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      // Jasmine globals live in test env; we ignore specs but keep rule safe.
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin
    },
    rules: {}
  }
];




