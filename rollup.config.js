import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import pkg from "./package.json";

export default {
	input: "src/extension.js",
	output: {
		file: pkg.main,
		format: "cjs"
	},
	external: [{ vscode: "commonjs vscode" }],
	plugins: [
		del({ targets: "dist/*" }),
		resolve(),
		commonjs(),
		globals(),
		builtins(),
		terser()
	],
	watch: {
		include: "src/**"
	}
};
