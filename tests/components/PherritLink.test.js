import PherritLink from '../../src/components/PherritLink.js';
import PherritData from '../mock_data/PherritLink.js';

const fs = require( 'fs' ),
	htmlWrapper = function ( data ) {
		return `<!DOCTYPE html>
<html>
<head>
    <title>PherritLink component test</title>
    <link href="./style.css" rel="stylesheet">
    <style>
    .test-table {
	font-family: sans-serif;
	font-size: 14px;
	border-collapse: collapse;
	margin: 50px auto;
	table-layout: fixed;
	width: 400px;
    }
    .test-pherrit {
	    width: 290px;
    }
    </style>
</head>
<body>
<table class="test-table">
${
	data.map( ( v, i ) => {
		return `
		<tr>
			<td class="test-label">${Object.keys( PherritData )[ i ]}</td>
			<td class="test-pherrit">${v.string}</td>
		</tr>
		`;
	} ).join( '' )
}
</table>
</body>
</html>
`;

	},
	pherrits = Object.keys( PherritData ).map( ( key ) => {
		return new PherritLink( PherritData[ key ] );
	} );

console.log( 'running layout' );

fs.writeFileSync( './tests/components/build/test.html', htmlWrapper( pherrits ) );
