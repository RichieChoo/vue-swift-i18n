const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const config = {
	target: "node",
	entry: "./src/extension.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "extension.cjs.js",
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: "../[resource-path]"
	},
	devtool: "source-map",
	externals: {
		vscode: "commonjs vscode"
	},
	resolve: {
		extensions: [".js"]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				sourceMap: false,
				terserOptions: {
					output: {
						comments: false
					},
					compress: {
						drop_console: true,
						warnings: false
					}
				},
				extractComments: false
			})
		]
	},
	plugins: [new webpack.ProgressPlugin()]
};
module.exports = config;
