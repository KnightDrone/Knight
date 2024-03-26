const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
    ...tsjPreset,
    preset: "react-native",
    transform: {
        "^.+\\.jsx$": "babel-jest",
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.jest.json",
            },
        ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    // add coverage
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,tsx}"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
};
