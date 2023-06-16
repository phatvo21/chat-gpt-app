// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  coverageThreshold: {
    global: {
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/**/*.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**',
    '!dist/**',
    '!jest.config.js',
    '!**/test/**',
    '!test/**',
    '!libs/**',
  ],
  coverageReporters: ['text', 'text-summary'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
  moduleNameMapper: {
    '@app/chat-api/(.*)': '<rootDir>/apps/chat-api/src/$1',
    '@app/chat-api': '<rootDir>/apps/chat-api/src',
    '@app/common/(.*)': '<rootDir>/libs/common/src/$1',
    '@app/common': '<rootDir>/libs/common/src',
  },
  setupFilesAfterEnv: ['jest-extended', './libs/common/tests/setup.testing.ts'],
};
