const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  transform: {
    "^.+\\.(js|jsx|ts)$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|react-navigation)/"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  moduleNameMapper: {
    "\\.(ttf|png|jpg)$": "<rootDir>/jestAssetTransformer.js",
  },
};



  // setupFiles: [
  //   "./node_modules/react-native-gesture-handler/jestSetup.js"
  // ],

  
