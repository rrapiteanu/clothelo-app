module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-native/no-inline-styles': 'off',
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
          },
        ],
        'react-hooks/exhaustive-deps': 'off',

        // 'prettier/prettier': 0,
        // quotes: 0,
        // semi: 0,
        // 'react/jsx-props-no-spreading': 0,
        // 'react/destructuring-assignment': 0,
        // 'no-unused-vars': 0,
        // '@typescript-eslint/no-unused-vars': 0,
        // 'comma-dangle': 0,
      },
    },
  ],
};
