/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: false,
  testEnvironment: "jest-fixed-jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@monitor/ui/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup-tests.ts"],
};
