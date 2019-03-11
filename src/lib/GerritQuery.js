/**
 * Class that builds and executes the Gerrit query.
 */
class GerritQuery {
	constructor( ticketNumbers ) {
		this.queryString = this.createQueryString( ticketNumbers );
		this.queryUrl = this.createUrl( this.queryString );
	}

	get url() {
		return this.queryUrl;
	}

	createQueryString( ticketNumbers ) {
		var combiner = '+OR+',
			ticketsLength = ticketNumbers.length,
			queryElements = ticketNumbers.map( ( num, i ) => {
				if ( i === ticketsLength - 1 ) {
					return `${num}`;
				} else {
					return `${num}${combiner}`;
				}
			} );
		return queryElements.join( '' );
	}

	createUrl( query ) {
		// for development, use proxy
		if ( window.location.hostname === 'localhost' ) {
			return `http://localhost:3000/gerrit?pp=0&o=TRACKING_IDS&o=DETAILED_LABELS&q=bug:${query}`;
		}
		return `https://gerrit.wikimedia.org/r/changes/?pp=0&o=TRACKING_IDS&o=DETAILED_LABELS&q=bug:${query}`;

	}

	fetch() {
		return fetch( this.url, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		} )
			.then( ( response ) => {
				return response.text();
			} )
			.then( ( responseText ) => {
				responseText = responseText.replace( /^.*\n/, '' );
				return JSON.parse( responseText );
			} )
			.catch( ( err ) => {
				console.log( err ); // eslint-disable-line
			} );
	}
}

export default GerritQuery;
