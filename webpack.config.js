const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");

const plugins = [
    new CompressionPlugin({
      asset: "[path].gz[query]"
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
const config= {
  mode: "production",
  entry: {
    'react-super-lite': ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    library: "ReactSuperLite",
    libraryTarget: "umd"
  },
  
  module: {
    rules
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {   }
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
module.exports =config;