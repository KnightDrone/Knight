module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      "@babel/preset-flow",
    ],
  };
};
