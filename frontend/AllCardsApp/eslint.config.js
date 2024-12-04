import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['*.js', '*.jsx'],
    languageOptions: {
    //   globals: {
    //     ...js.configs.recommended.languageOptions.globals,
    //   },
      ecmaVersion: 'latest',
      sourceType: 'module',
    //   ecmaFeatures: {
    //     jsx: true,
    //   },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
