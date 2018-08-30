/**
 * Class responsible for taking data and rendering it into the DOM
 */
class Renderer {

	constructor() {
		this.parser = new DOMParser();
	}

	createDOMFragment( string ) {
		var fragment = this.parser.parseFromString( string, 'text/html' );
		return fragment;
	}

	appendTemplateToDOM( template, el ) {
		if ( el ) {
			el.append( template.body.firstChild );
		}
	}
}

export default Renderer;
