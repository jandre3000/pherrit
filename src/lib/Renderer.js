/**
 * Class responsible for taking data and rendering it into the DOM
 */
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
				0: 'pherrit--neutral',
				1: 'pherrit--medium',
				2: 'pherrit--high'
			};
		return `
		<a target="_blank" href="${data.url}" class="pherrit ${scoreClasses[ averageScore ]} pherrit--status-${data.status}">
			<span class="pherrit__title">
				${data.title}
			</span>
			<span class="pherrit__score">
				${data.codeReviewScore.join( ',' )}
			</span>
		</a>
		`;
	}

	createDOMFragment( string ) {
		var fragment = this.parser.parseFromString( string, 'text/html' );
		return fragment;
	}
	createDOMTemplate( data ) {
		var domString = this.createTemplateString( data ),
			domFragment = this.createDOMFragment( domString );
		return domFragment;
	}
}

export default Renderer;
