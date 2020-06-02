const path = require("path");
const webpack = require("webpack");
const config = {
	target: "node",
	entry: "./src/extension.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "extension.cjs.js",
		libraryTarget: "commonjs2",
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
	devtool: "source-map",
	externals: {
		vscode: "commonjs vscode",
	},
	resolve: {
		extensions: [".js"],
	},
};
module.exports = config;
