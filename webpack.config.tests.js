const path = require( 'path' ),
	MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ),
	CleanWebpackPlugin = require( 'clean-webpack-plugin' ),
	WebpackShellPlugin = require( 'webpack-shell-plugin' );

module.exports = {
	mode: 'development',
	target: 'node',
	watch: true,

	entry: path.resolve( __dirname, 'tests/components/PherritLink.test.js' ),

	output: {
		path: path.resolve( __dirname, 'tests/components/build' ),
		filename: 'run_test.js'
	},

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' ]
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin( 'test/components/build', {} ),
		new MiniCssExtractPlugin( {
			filename: 'style.css'
		} ),
		new WebpackShellPlugin( { safe: true, onBuildExit: [ 'node ./tests/components/build/run_test.js' ] } )
	]

};
