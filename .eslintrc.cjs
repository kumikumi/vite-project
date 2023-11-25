module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: ["vite.config.ts", ".eslintrc.cjs"],
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.node.json",
      },
    },
  ],
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-import'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/consistent-type-assertions': 'warn',
    'prettier/prettier': 'warn',
    'no-var': 'warn',
    'prefer-const': 'warn',
    'prefer-template': 'warn',
    'prefer-spread': 'warn',
    'no-else-return': 'warn',
    'no-alert': 'warn',
    'prefer-arrow-callback': 'warn',
    'curly': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-empty': [
      'warn',
      {
        'allowEmptyCatch': true
      }
    ],
    'no-constant-condition': 'warn',
    'one-var': [
      'warn',
      'never'
    ],
    'sort-imports': [
      'warn',
      {
        'ignoreDeclarationSort': true
      }
    ],
    'import/order': [
      'warn',
      {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index', 'object', 'type']],
        'newlines-between': 'always'
      }
    ],
    'no-undef': 'off',
    'eqeqeq': 'warn',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
