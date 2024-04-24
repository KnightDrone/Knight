const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jestSetupFile.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transform: {
    "^.+\\.(js|jsx|ts)$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  // ignore the src/services/ folder
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/services/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  moduleNameMapper: {
    "\\.(ttf|png|jpg)$": "<rootDir>/jestAssetTransformer.js",
    "\\.(css)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native|@react-native|@react-navigation|@firebase|firebase|@react-native-async-storage)",
  ],
};

// setupFiles: [
//   "./node_modules/react-native-gesture-handler/jestSetup.js"
// ],
