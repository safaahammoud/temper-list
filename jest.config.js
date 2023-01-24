module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.{ts,vue}',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  moduleNameMapper: {
    '^@tests(.*)$': '<rootDir>/tests$1',
    'axios': 'axios/dist/node/axios.cjs',
  },
  testResultsProcessor: 'jest-sonar-reporter',
  transformIgnorePatterns: [
    'node_modules/',
  ],
  setupFiles: [
    'jest-canvas-mock',
  ],
  globals: {
    'ts-jest': {
      babelConfig: true,
      isolatedModules: true,
    },
  },
};
