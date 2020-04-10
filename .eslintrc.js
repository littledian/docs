module.exports = {
  extends: ['alloy', 'alloy/react', 'alloy/typescript', 'prettier'],
  plugins: ['prettier', 'react-hooks'],
  env: {
    browser: true
  },
  globals: {},
  rules: {
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public'
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'error'
  },
  overrides: [
    {
      files: ['gatsby-config.js', 'gatsby-node.js'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-require-imports': ['off']
      }
    },
    {
      files: ['**/**.d.ts'],
      rules: {
        'spaced-comment': ['off']
      }
    }
  ]
};
