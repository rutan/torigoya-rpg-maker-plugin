export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  modulePaths: ['<rootDir>/src/'],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
