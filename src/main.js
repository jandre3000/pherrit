import Page from './lib/Page.js';
import GerritQuery from './lib/GerritQuery.js';
import GerritResponseParser from './lib/GerritResponseParser.js';
import Renderer from './lib/Renderer.js';
import PherritLink from './components/PherritLink';
import PherritLinkGroup from './components/PherritLinkGroup';

function init() {

	var page = new Page(),
		gerritQuery = new GerritQuery( page.ticketNumbers ),
		parser = new GerritResponseParser(),
		renderer = new Renderer();

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
