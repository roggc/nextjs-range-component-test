"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));
var _cleanWebpackPlugin = require("clean-webpack-plugin");
var _webpack = _interopRequireDefault(require("webpack"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = exports["default"] = {
  entry: "./src/index.js",
  module: {
    exprContextCritical: false,
    rules: [{
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /(node_modules)/,
      use: {
        loader: "babel-loader"
      }
    }]
  },
  plugins: [new _cleanWebpackPlugin.CleanWebpackPlugin(), new _htmlWebpackPlugin["default"]({
    template: "./src/public/index.html"
  }), new _webpack["default"].ProvidePlugin({
    Buffer: ["buffer", "Buffer"],
    process: "process/browser.js"
  })],
  resolve: {
    fallback: {
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/")
    }
  }
};