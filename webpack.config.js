const path = require( 'path' ),
	MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ),
	CleanWebpackPlugin = require( 'clean-webpack-plugin' );

module.exports = {
	mode: 'development',
	entry: path.resolve( __dirname, 'src/main.js' ),

	output: {
		path: path.resolve( __dirname, 'build/chrome' ),
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
		new CleanWebpackPlugin( 'dist', {} ),
		new MiniCssExtractPlugin( {
			filename: 'style.css'
		} )
	]

};
