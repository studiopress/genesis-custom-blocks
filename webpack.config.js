/**
 * External dependencies
 */
const path = require( 'path' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const IgnoreEmitPlugin = require( 'ignore-emit-webpack-plugin' );

/**
 * WordPress dependencies
 */
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const { defaultRequestToExternal, defaultRequestToHandle } = require( '@wordpress/dependency-extraction-webpack-plugin/lib/util' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	...defaultConfig,
	entry: {
		'./js/dist/block-editor': './js/src/block-editor/index.js',
		'./js/dist/edit-block': './js/src/edit-block/index.js',
		'./css/dist/blocks.editor': './css/src/editor.scss',
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
				test: /editor\.s?css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// Only allow hot module reloading in development.
							hmr: process.env.NODE_ENV === 'development',
							// Force reloading if hot module reloading does not work.
							reloadAll: true,
						},
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: [ require( 'autoprefixer' ) ],
						},
					},
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
			filename: './css/dist/blocks.editor.css',
		} ),
		// Copied from Gutenberg.
		// MiniCSSExtractPlugin creates JavaScript assets for CSS that are
		// obsolete and should be removed. Related webpack issue:
		// https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
		new IgnoreEmitPlugin( [ 'block-editor.js' ] ),
		new DependencyExtractionWebpackPlugin( {
			useDefaults: false,
			requestToHandle: ( request ) => {
				switch ( request ) {
					case '@wordpress/dom-ready':
					case '@wordpress/i18n':
					case '@wordpress/server-side-render':
					case '@wordpress/url':
						return undefined;

					default:
						return defaultRequestToHandle( request );
				}
			},
			requestToExternal: ( request ) => {
				switch ( request ) {
					case '@wordpress/dom-ready':
					case '@wordpress/i18n':
					case '@wordpress/server-side-render':
					case '@wordpress/url':
						return undefined;

					default:
						return defaultRequestToExternal( request );
				}
			},
		} ),
	],
};
