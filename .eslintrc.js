require('@babel/register');

const schemaJson = require('/home/jpoppe/ga/signals-frontend/graphql/schema.json');

// Issue about ignored rules: https://github.com/apollographql/eslint-plugin-graphql/issues/19
// const { specifiedRules: graphqlRules } = require('graphql');
// const graphQlIgnoredRules = ['NoUnusedFragmentsRule', 'KnownFragmentNamesRule', 'NoUnusedVariablesRule'];
// const graphQlValidators = graphqlRules
//   .map(rule => rule.name)
//   .filter(ruleName => !graphQlIgnoredRules.includes(ruleName));

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:cypress/recommended', 'prettier', 'prettier/react'],
  plugins: ['cypress', 'prettier', 'redux-saga', 'react', 'react-hooks', 'jsx-a11y'],
  env: {
    browser: true,
    'cypress/globals': true,
    es6: true,
    jest: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    jsdom: true,
    L: true,
  },

  overrides: [
    {
      files: ['src/graphql/**/*.js'],
      plugins: ['graphql'],
      rules: {
        'graphql/named-operations': ['error', { tagName: 'gql', schemaJson }],
        'graphql/capitalized-type-name': ['error', { tagName: 'gql', schemaJson }],
        'graphql/no-deprecated-fields': ['error', { tagName: 'gql', schemaJson }],
        'graphql/required-fields': ['error', { tagName: 'gql', requiredFields: ['id'], schemaJson }],
        'graphql/template-strings': ['error', {
          tagName: 'gql',
          schemaJson,
          validators: [
            'ExecutableDefinitionsRule',
            'UniqueOperationNamesRule',
            'LoneAnonymousOperationRule',
            'SingleFieldSubscriptionsRule',
            'KnownTypeNamesRule',
            'FragmentsOnCompositeTypesRule',
            'VariablesAreInputTypesRule',
            'ScalarLeafsRule',
            'FieldsOnCorrectTypeRule',
            'UniqueFragmentNamesRule',
            'PossibleFragmentSpreadsRule',
            'NoFragmentCyclesRule',
            'UniqueVariableNamesRule',
            'NoUndefinedVariablesRule',
            'KnownDirectivesRule',
            'UniqueDirectivesPerLocationRule',
            'KnownArgumentNamesRule',
            'UniqueArgumentNamesRule',
            'ValuesOfCorrectTypeRule',
            'ProvidedRequiredArgumentsRule',
            'VariablesInAllowedPositionRule',
            'OverlappingFieldsCanBeMergedRule',
            'UniqueInputFieldNamesRule',
          ],
        }],
      },
    },
  ],
  rules: {
    camelcase: 0,
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': [2, { commonjs: true }],
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    indent: [2, 2, { SwitchCase: 1 } ],
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        // NOTE: If this error triggers, either disable it or add
        // your custom components, labels and attributes via these options
        // See https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
        controlComponents: ['Input'],
      },
    ],
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'linebreak-style': [2, 'unix'],
    'max-len': 0,
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'no-console': 1,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': [0, { allow: ['_display', '_links'] }],
    'no-unused-vars': 2,
    'no-use-before-define': 0,
    'object-curly-spacing': [1, 'always'],
    'padded-blocks': ['error', 'never'],
    'prefer-template': 2,
    'quote-props': [2, 'as-needed'],
    'react/destructuring-assignment': 0,
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'react/jsx-closing-tag-location': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline-multiprop'],
    'react/jsx-filename-extension': 0,
    'react/jsx-no-target-blank': 0,
    'react/jsx-uses-vars': 2,
    'react/require-default-props': 0,
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/sort-comp': 0,
    'redux-saga/no-yield-in-race': 2,
    'redux-saga/yield-effects': 2,
    'require-yield': 0,
    'space-in-parens': ['error', 'never'],
    'react/jsx-props-no-spreading': 0,
    'prefer-destructuring': 0,
    'react/jsx-fragments': [1, 'element'],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-indent': [2, 2, { checkAttributes: true }],
    semi: 2,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.react.js'],
        moduleDirectory: ['node_modules', './src'],
      },
    },
  },
};
