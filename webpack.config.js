const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const mode = process.env.NODE_ENV || "production";
const devMode = mode !== "production";

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "build"),
    filename: devMode ? "[name].js" : "[name].[contenthash:8].js",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },

  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    ...(devMode
      ? []
      : [new MiniCssExtractPlugin({ filename: "[name].[contenthash:8].css" })]),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/favicon.ico",
          to: "favicon.ico",
        },
      ],
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    open: true,
    hot: true,
  },

  mode,
};
