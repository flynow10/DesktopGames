const rules = require("./webpack.rules");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");

rules.push({
  test: /\.css$/,
  use: [
    { loader: "vue-style-loader" },
    { loader: "style-loader" },
    { loader: "css-loader" },
  ],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: true,
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
