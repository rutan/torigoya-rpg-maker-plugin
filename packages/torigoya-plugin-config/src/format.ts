import { format as prettier } from 'prettier';

export function format(code: string) {
  return prettier(code, {
    parser: 'babel',
    printWidth: 120,
    tabWidth: 4,
    singleQuote: true,
  });
}
