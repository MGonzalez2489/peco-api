const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/index.ts$',
    '\\.module\\.ts$',
    '\\.seeder\\.ts$',
    '\\.enum\\.ts$',
    '\\.entity\\.ts$',
    'constants\\.ts$',
    'main.ts',
    'jest.config.js',
    '.eslintrc.js',
    'db-initializer.ts',
    'src/config/configuration.ts',
    'src/config/swagger.config.ts',
    'src/datasource/datasource.ts',
    'test/',
  ],
};
