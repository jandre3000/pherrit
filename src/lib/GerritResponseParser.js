/**
 * Class that parses the response from the Phabricator API and returns just the necessary data.
 */
class GerritResponseParser {
	formatJSON( response ) {
		return response.reduce( ( acc, r ) => {
			var phab = r.tracking_ids.find( ( i ) => i.system === 'Phab' );

			if ( phab ) {

				acc.push( {
					ticketNumber: phab.id,
					title: r.subject,
					url: `https://gerrit.wikimedia.org/r/#/c/${r.project}/+/${r._number}/`, // eslint-disable-line
					codeReviewScore: this.parseCodeReviewScore( r ) || 0,
					status: r.status
				} );
			}
			return acc;
		}, [] );
	}

	parseCodeReviewScore( r ) {
		if ( r.labels[ 'Code-Review' ] && r.labels[ 'Code-Review' ].all ) {
			return r.labels[ 'Code-Review' ].all.reduce( ( c, v ) => {
				if ( v.value !== 0 ) {
					c.push( v.value );
				}
				return c;
			}, [] );
		}
		return [ 0 ];

	}

}

export default GerritResponseParser;
