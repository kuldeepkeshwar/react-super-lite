const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

const env=process.env.NODE_ENV;
const NODE_ENV = {
  BUILD: "build",
  DEVELOPMENT: "development"
};
const plugins = [
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "index.html"
  }),
  new webpack.optimize.ModuleConcatenationPlugin()
];

const rules = [
  {
    test: /\.jsx?$/,
    include: [path.resolve(__dirname, "src")],
    exclude: /node_modules/,
    loader: "babel-loader"
  }
];
const common= {
  mode: "production",
  entry: {
    index: ["./src/Demo/index.js"],
    react: ["./src/React/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      react: path.resolve(__dirname, "src/React/index.js")
    }
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 400000,
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    }
  },
  devtool: "source-map",
  context: __dirname,
  target: "web",
  plugins
};
const lib = {
  ...common,
  entry: {
    react: ["./src/React/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js"
  },
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]"
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};
const demo={...common}
module.exports =
  env === NODE_ENV.DEVELOPMENT ? [demo] : [lib, demo];