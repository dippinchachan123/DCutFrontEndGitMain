const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx", // Replace with the entry point of your application.
  output: {
    filename: "bundle.js", // Replace with the desired output file name.
    path: path.resolve(__dirname, "dist"), // Replace with the output directory.
  },
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      util: require.resolve("util/"),
      child_process: false,
      url: require.resolve("url/"),
    },
  },
  plugins: [
    new NodePolyfillPlugin(), // Add the NodePolyfillPlugin to handle additional polyfills.
  ],
};

