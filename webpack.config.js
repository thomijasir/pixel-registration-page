'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: path.resolve(__dirname, 'src') + '/index.jsx',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js',
		publicPath: '/public/',
	},
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				// exclude: /node_modules/,
				include: path.resolve(__dirname, 'src'),
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015'],
				},
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'file-loader?limit=100000',
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
		}),
	],
	devServer: {
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 8800,
	},
}