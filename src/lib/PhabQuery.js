class PhabQuery {
	getHost() {
		// for development, use proxy
		if ( window.location.hostname === 'localhost' ) {
			return 'http://localhost:3000/';
		}
		return 'https://phabricator.wikimedia.org/';
	}

	fetch( ids ) {
		var url = `${this.getHost()}api/maniphest.query`,
			data = [
				'api.token=cli-4ovi7i7rf432h6gkcmxd5z4shlct'
			].concat( ids.map( ( id, i ) => `ids[${i}]=${id.substr( 1 )}` ) );
		return fetch( url, {
			method: 'POST',
			credentials: 'omit',
			body: data.join( '&' ),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		} )
			.then( ( response ) => {
				return response.json();
			} )
			.then( ( json ) => {
				return Object.keys( json.result ).map( ( key ) => json.result[ key ] );
			} )
			.catch( ( err ) => {
				console.log( err ); // eslint-disable-line
			} );
	}
}
export default PhabQuery;
