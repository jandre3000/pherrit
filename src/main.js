import Page from './lib/Page.js';
import GerritQuery from './lib/GerritQuery.js';
import GerritResponseParser from './lib/GerritResponseParser.js';
import Renderer from './lib/Renderer.js';
import PherritLink from './components/PherritLink';

var page = new Page(),
	gerritQuery = new GerritQuery( page.ticketNumbers ),
	parser = new GerritResponseParser(),
	renderer = new Renderer();

if ( Object.keys( page.cardMap ).length > -1 ) {

	gerritQuery.fetch()
		.then( ( responseText ) => {
			var formattedJSON = parser.formatJSON( responseText );

			formattedJSON.forEach( ( data ) => {
				const template = new PherritLink( data ),
					DOMTemplate = renderer.createDOMFragment( template.string );
				renderer.appendTemplateToDOM( DOMTemplate, page.cardMap[ data.ticketNumber ] );
			} );
		} );

}
