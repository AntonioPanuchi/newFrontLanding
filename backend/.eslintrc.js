module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      globals: {
        test: 'readonly',
      },
    },
  ],
};
