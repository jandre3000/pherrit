import Page from './lib/Page.js';
import GerritQuery from './lib/GerritQuery.js';
import GerritResponseParser from './lib/GerritResponseParser.js';
import Renderer from './lib/Renderer.js';
import PherritLink from './components/PherritLink';
import PherritLinkGroup from './components/PherritLinkGroup';

var page = new Page(),
	gerritQuery = new GerritQuery( page.ticketNumbers ),
	parser = new GerritResponseParser(),
	renderer = new Renderer();

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
					if ( patchGroupName !== 'NEW' ) {
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
