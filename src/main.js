import Page from './lib/Page.js';
import GerritQuery from './lib/GerritQuery.js';
import GerritResponseParser from './lib/GerritResponseParser.js';
import Renderer from './lib/Renderer.js';
import PhabQuery from './lib/PhabQuery';
import PherritLink from './components/PherritLink';
import PherritLinkGroup from './components/PherritLinkGroup';

function getOpacityFromTimestamp( epoch, maxAgeDays ) {
	var daysOld,
		d = new Date( 0 );
	d.setUTCSeconds( epoch );
	daysOld = ( new Date() - d ) / 1000 / 60 / 60 / 24;
	// if a card is older than a year (360 days), make it 0.2

	return 1 - ( 0.8 * Math.min( 1, daysOld / maxAgeDays ) );
}
function init() {

	var page = new Page(),
		gerritQuery = new GerritQuery( page.ticketNumbers ),
		parser = new GerritResponseParser(),
		phab = new PhabQuery(),
		renderer = new Renderer();

	phab.fetch( page.ticketNumbers ).then( function ( tickets ) {
		tickets.forEach( function ( { id, dateModified, dateCreated } ) {
			// set card style
			var card = page.cardMap[ `T${id}` ];
			if ( card ) {
				card.style.setProperty( 'opacity', getOpacityFromTimestamp( dateModified, 360 ) );
				card.querySelector( '.phui-oi-link' ).style.setProperty( 'opacity',
					getOpacityFromTimestamp( dateCreated, 360 * 2 ) );
			}
		} );
	} );
	// define t-shirt sizing support
	Array.from( document.querySelectorAll( '.phui-tag-core' ) ).forEach( ( node ) => {
		switch( node.textContent.trim() ) {
			case '8':
				node.textContent = 'XL (8)';
				break;
			case '5':
				node.textContent = 'L (5)';
				break;
			case '3':
				node.textContent = 'M (3)';
				break;
			case '2':
				node.textContent = 'S (2)';
				break;
			case '1':
				node.textContent = 'XS (1)';
				break;
			default:
				break;
		}
	} );
	if ( Object.keys( page.cardMap ).length > -1 ) {

		gerritQuery.fetch()
			.then( ( responseText ) => {
				var formattedJSON = parser.formatJSON( responseText ),
					patchesByTicketId = parser.groupByTicketAndStatus( formattedJSON );
				Object.keys( patchesByTicketId ).forEach( ( ticketId ) => {
					const patches = patchesByTicketId[ ticketId ];
					Object.keys( patches ).sort().reverse().forEach( ( patchGroupName ) => {
						let patchGroup = patches[ patchGroupName ],
							domFragment,
							template,
							templateString;
						// group sets of non-new patches
						if ( patchGroup.length > 1 && patchGroupName !== 'NEW' ) {
							template = new PherritLinkGroup(
								patchGroupName,
								patchGroup.map( ( patch ) => new PherritLink( patch ) )
							);
						} else {
							template = patchGroup.reduce( ( tmpGroup, patch ) => {
								const tmp = new PherritLink( patch );
								tmpGroup += tmp.string;
								return tmpGroup;
							}, '' );
						}

						templateString = template.string || template;
						domFragment = renderer.createDOMFragment( templateString );
						renderer.appendTemplateToDOM( domFragment, page.cardMap[ ticketId ] );
					} );
				} );
			} );
	}

}
if ( window.location.hostname === 'localhost' ) {
	document.addEventListener( 'DOMContentLoaded', init, false );
} else {
	init();
}
