export default {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  arrowParens: 'always',
  importOrder: ['<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>', '^[./]'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
