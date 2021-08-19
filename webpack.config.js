/**
 * External dependencies
 */
const path = require( 'path' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	...defaultConfig,
	entry: {
		'./js/dist/block-editor': './js/src/block-editor/index.js',
		'./js/dist/edit-block': './js/src/edit-block/index.js',
		'./css/dist/blocks.editor': './css/src/editor.scss',
		'./css/dist/edit-block': './css/src/edit-block.scss',
	},
	output: {
		path: path.resolve( __dirname ),
		filename: '[name].js',
	},
	watch: false,
	mode: isProduction ? 'production' : 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /css\/src\/[^_].*\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin( {
			cleanOnceBeforeBuildPatterns: [ 'js/dist', 'css/dist' ],
		} ),
		new MiniCssExtractPlugin( {
			filename: '[name].css',
		} ),
	],
};
