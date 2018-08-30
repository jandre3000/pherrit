import css from './PherritLink.css'; // eslint-disable-line

class PherritLink {
	constructor( data ) {
		this.string = this.template( data );
	}

	template( data ) {

		const	url = data.url,
			title = data.title,
			status = data.status,
			totalScore = data.codeReviewScore.reduce( ( s, i ) => {
				return s + i;
			}, 0 ),
			averageScore = Math.round( totalScore / data.codeReviewScore.length ) || 0,
			scoreClasses = {
				'-2': 'pherrit--very-low',
				'-1': 'pherrit--low',
				0: 'pherrit--neutral',
				1: 'pherrit--medium',
				2: 'pherrit--high'
			},
			scoreClass = scoreClasses[ averageScore ],
			codeReviewScores = data.codeReviewScore.reduce( ( acc, score ) => {
				return acc.concat(
					( score > 0 ) ? '+' + score + ', ' : score + ', '
				);
			}, '' ).slice( 0, -2 );
		return `
			<a target="_blank" href="${url}" class="pherrit ${scoreClass} pherrit--status-${status}">
				<span class="pherrit__title">
					${title}
				</span>
				<span class="pherrit__score">
					${codeReviewScores}
				</span>
			</a>
		`;
	}
}

export default PherritLink;
