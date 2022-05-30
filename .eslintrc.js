module.exports = {
  root: true,
  extends: ['@sorenhoyer/eslint-config-base'],
  ignorePatterns: [
    '.vscode',
    'coverage',
    'dist',
    'node_modules',
    '__generated__',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
