module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  // Add these lines for test reports
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-reports',
      outputName: 'junit.xml'
    }]
  ]
};