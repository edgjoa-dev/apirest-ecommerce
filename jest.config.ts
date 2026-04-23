export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/test", "<rootDir>/src/tests"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: ["src/**/*.ts"]
};
