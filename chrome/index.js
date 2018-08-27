class Page {
	get cards() {
		return document.querySelectorAll( '[data-sigil=" project-card"]' );
	}

	get ticketNumbers() {
		const cardArray = Array.from( this.cards );
		return cardArray.map( card => {
			return this.getTicketNumberFromCard( card );
		})
	}

	get cardMap() {
		const cardArray = Array.from( this.cards );
		return cardArray.reduce( (cardObj, card) => {
			const num = this.getTicketNumberFromCard( card )
			cardObj[ num ] = card;
			return cardObj;
		}, {} )
	}

	getTicketNumberFromCard( cardDOM ) {
		return cardDOM.querySelector( '.phui-oi-objname' ).innerHTML;
	}
}

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
	queryElements = ticketNumbers.map( (num, i) => {
		if ( i === ticketsLength - 1 ) {
			return `${num}`
		} else {
			return `${num}${combiner}`
		}
	} )
	return queryElements.join('');
  }

  createUrl( query ) {
    return `https://gerrit.wikimedia.org/r/changes/?pp=0&o=TRACKING_IDS&o=DETAILED_LABELS&q=bug:${query}`;
	}

	fetch() {
		return fetch( this.url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		} )
		.then( response => {
			return response.text()
			} )
		.then( responseText => {
			responseText = responseText.replace(/^.*\n/, '')
			return JSON.parse( responseText );
		})
		.catch( err => { console.log( err ) } );
	}
}

class GerritResponseParser {
	formatJSON( response ) {
		return response.reduce( (acc, r) => {
			var phab = r.tracking_ids.find( i => i.system === "Phab" );

			if ( phab ) {

				acc.push({
					ticketNumber: phab.id,
					title: r.subject,
					url: `https://gerrit.wikimedia.org/r/#/c/${r.project}/+/${r._number}/`,
					codeReviewScore: this.parseCodeReviewScore( r ) || 0,
					status: r.status
				})
			}
			return acc;
		}, [] )
	}

	parseCodeReviewScore( r ) {
		if ( r.labels['Code-Review'] && r.labels['Code-Review'].all ) {
			return r.labels['Code-Review'].all.reduce( (c, v ) => {
				if ( v.value !== 0 ) {
					c.push( v.value );
				}
				return c;
			}, [] )
		}
		return [0];

	}

}

class Renderer {

	constructor() {
		this.parser = new DOMParser();
	}

	createTemplateString( data ) {
		const totalScore = data.codeReviewScore.reduce( ( s, i ) => {
			return s + i;
		}, 0 ),
		averageScore = Math.round( totalScore / data.codeReviewScore.length ) || 0,
		scoreClasses = {
			'-2': 'pherrit--very-low',
			'-1': 'pherrit--low',
			'0': 'pherrit--neutral',
			'1': 'pherrit--medium',
			'2': 'pherrit--high'
		}
		return `
		<a target="_blank" href="${data.url}" class="pherrit ${scoreClasses[averageScore]} pherrit--status-${data.status}">
			<span class="pherrit__title">
				${data.title}
			</span>
			<span class="pherrit__score">
				${data.codeReviewScore.join(',')}
			</span>
		</a>
		`
	}

	createDOMFragment( string ){
		var fragment = this.parser.parseFromString( string, "text/html" );
		return fragment;
	}
	createDOMTemplate( data ) {
		var domString = this.createTemplateString( data );
		var domFragment = this.createDOMFragment( domString );
		return domFragment;
	}
}
const queryUrl = "";

var page = new Page();
var gerritQuery = new GerritQuery( page.ticketNumbers )
var parser = new GerritResponseParser();
var renderer = new Renderer();

if ( Object.keys( page.cardMap ).length > -1 ){

	gerritQuery.fetch()
	.then( responseText => {
		var formattedJSON = parser.formatJSON( responseText )

		formattedJSON.forEach( ( data, i ) => {
			const template = renderer.createDOMTemplate( data );
			if ( page.cardMap[ data.ticketNumber ]  ) {
				page.cardMap[ data.ticketNumber ].append( template.body.firstChild );
			}
		} )
	})

}
