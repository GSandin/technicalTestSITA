import { Config } from 'jest';

const config: Config = {
  preset: "jest-preset-angular",
  roots: ["src"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/app/$1",
    "@env": "<rootDir>/src/environments/environment",
    "@src/(.*)": "<rootDir>/src/src/$1",
  },
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!<rootDir>/node_modules/",
    "!<rootDir>/test/",
  ],
};

module.exports = config;
