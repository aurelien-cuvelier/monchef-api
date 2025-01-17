import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"], // Specify test and source roots
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for TypeScript files
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      isolatedModules: true, // Ensures Jest handles TS modules correctly
    },
  },
  collectCoverage: true, // Collect coverage reports
  collectCoverageFrom: ["src/**/*.ts"], // Include only source files for coverage
};

export default config;
