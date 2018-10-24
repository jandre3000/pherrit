const path = require( 'path' ),
	MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ),
	CleanWebpackPlugin = require( 'clean-webpack-plugin' ),
	CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	mode: 'production',
	entry: path.resolve( __dirname, 'src/main.js' ),
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: 'main.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ 'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' ]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin( 'build' ),
		new CopyWebpackPlugin( [
			{ from: 'src/manifest.json', to: 'manifest.json', toType: 'file' },
			{ from: 'src/images/pherrit-logo.png', to: 'pherrit-logo.png', toType: 'file' }
		] ),
		new MiniCssExtractPlugin( {
			filename: 'style.css'
		} )
	]

};
