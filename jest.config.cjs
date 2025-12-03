/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/ui/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.{ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/ui/',
    '<rootDir>/src/.stories/'
  ]
};
