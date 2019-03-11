/**
 * This is an express app that reverse-proxies Phabricator and Gerrit.
 * it serves https://phabricator.wikimedia.org/ at http://localhost:3000/
 * and https://gerrit.wikimedia.org/r/changes/? at http://localhost:3000/gerrit
 *
 * It also injects the Pherrit script & stylesheet into Phabricator.
 *
 * The purpose of this proxy is to bypass CORS and CSP, essentially mimicking
 * the capabilities of the chrome extension.
 *
 */

var express = require( 'express' ),
	querystring = require( 'querystring' ),
	fetch = require( 'node-fetch' ),
	app = express();

app.use( express.static( 'build' ) );

app.use( '/gerrit', function ( req, resp ) {
	var queryString = querystring.stringify( req.query );
	return fetch( 'https://gerrit.wikimedia.org/r/changes/?' + queryString )
		.then( ( response ) => response.text() )
		.then( ( text ) => resp.send( text ) )
		.catch( ( err ) => resp.send( err ) );
} );

app.use( '/', function ( req, resp ) {
	var queryPath = req.path;
	return fetch( 'https://phabricator.wikimedia.org' + queryPath )
		.then( ( response ) => response.text() )
		.then( ( text ) => {
			text = text.replace( /<\/head>/g, '<link rel="stylesheet" type="text/css" href="/style.css"></head>' );
			text = text.replace( /<\/body>/g, '<script src="/main.js"></script></body>' );
			resp.send( text );
		} )
		.catch( ( err ) => resp.send( err ) );
} );

app.listen( process.env.PORT || 3000 );
