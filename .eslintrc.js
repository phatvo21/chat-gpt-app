module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'no-loops', 'jest-formatting'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'auto',
    'plugin:jest-formatting/recommended',
  ],

  root: true,
  ignorePatterns: ['*.js'],
  rules: {
    'no-new': 0,
    'no-param-reassign': 0,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'no-secrets/no-secrets': 'error',
    'max-classes-per-file': 0,
    'implicit-arrow-linebreak': 0,
    'object-curly-newline': 0,
    'no-unused-expressions': [
      2,
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    'no-restricted-globals': 0,
    camelcase: 0,
    eqeqeq: ['error', 'smart'],
    'max-lines': [2, { max: 1000, skipBlankLines: true }],
    'no-nested-ternary': 0,
    'no-console': [2, { allow: ['warn', 'error', 'info', 'trace'] }],
    'func-names': 0,
    'global-require': 0,
    'no-extra-bind': 2,
    'class-methods-use-this': 0,
    'arrow-body-style': [0, 'as-needed', { requireReturnForObjectLiteral: true }],
    'new-cap': [2, { newIsCap: false, capIsNew: false }],
    'no-underscore-dangle': [
      2,
      {
        allowAfterThis: true,
        enforceInMethodNames: true,
        allow: ['_id', '__v', '__MONGO_URI__', '__MONGO_DB_NAME__', '_v'],
      },
    ],
    quotes: 'off',
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],

    'sort-imports': 'off',

    '@typescript-eslint/quotes': [0],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-useless-constructor': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    'const-case/uppercase': 'off',
    '@typescript-eslint/unbound-method': 'off',

    'import/order': 'off',
    'import/no-extraneous-dependencies': [1, { devDependencies: true }],
    'import/namespace': 0,
    'import/prefer-default-export': 0,
    'import/extensions': ['off', 'never'],
    'lodash/import-scope': 0,
    'lodash/prefer-lodash-method': 0,
    'lodash/prefer-constant': 0,
    'lodash-fp/prefer-constant': 0,

    'no-loops/no-loops': 2,
    'pii/no-phone-number': 'off',
    'pii/no-ip': 'off',
    'pii/no-email': 'off',

    'unicorn/prefer-node-protocol': 0,
    'unicorn/prefer-module': 0,
    'unicorn/no-array-callback-reference': 0,
    'unicorn/no-array-method-this-argument': 0,
    'unicorn/no-object-as-default-parameter': 0,
    'no-promise-executor-return': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',

    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],

    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'request.**.expect', 'agent', 'agent.**.expect', '**.agent.**.expect'],
      },
    ],
  },
};
