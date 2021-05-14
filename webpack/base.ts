import { resolve } from "path"

export default {
	target: "node",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	entry: {
		index: resolve(__dirname, "../src/index.ts")
	},
	output: {
		path: resolve(__dirname, "../build"),
		filename: "[name].js",
		sourceMapFilename: "[file].map",
		library: {
			name: "@evocount/signal",
			type: "umd"
		}
	}
}
