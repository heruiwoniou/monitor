/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: false,
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@repo/ui/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup-tests.ts"],
};
