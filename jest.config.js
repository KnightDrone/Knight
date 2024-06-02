const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jestSetupFile.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  globals: {
    "process.env": {
      EXPO_PUBLIC_STRIPE_ENDPOINT_URL: "your-stripe-endpoint-url",
    },
  },
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
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/services/**",
    "!src/**/*.d.ts",
    "!src/**/*.test.tsx",
    "!src/lang/**",
    "!src/types/**",
    "!src/utils/**",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  moduleNameMapper: {
    "\\.(ttf|png|jpg)$": "<rootDir>/jestAssetTransformer.js",
    "\\.(css)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native|@react-native|@react-navigation|@firebase|firebase|firebase/firestore|firebase/app|@react-native-async-storage|@stripe/stripe-react-native)",
  ],
};

// setupFiles: [
//   "./node_modules/react-native-gesture-handler/jestSetup.js"
// ],
