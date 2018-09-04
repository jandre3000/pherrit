const pherritData = {

	neutral: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that doesn\'t have any code review scores',
		status: 'NEW',
		codeReviewScore: []
	},
	minusTwo: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that has been minus-twoed in code review',
		status: 'NEW',
		codeReviewScore: [ -2 ]
	},
	minusOne: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that has been minus-oned in code review',
		status: 'NEW',
		codeReviewScore: [ -1 ]
	},
	plusOne: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that has been plus oned in code review',
		status: 'NEW',
		codeReviewScore: [ 1 ]
	},
	plusTwo: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that has been plus twoed but not merged',
		status: 'NEW',
		codeReviewScore: [ 2 ]
	},
	merged: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that has been merged',
		status: 'MERGED',
		codeReviewScore: [ 2, 1, 1 ]
	},
	abandoned: {
		url: 'https://wikimedia.gerrit.org',
		title: 'A patch that has been abandoned',
		status: 'ABANDONED',
		codeReviewScore: [ 1, 1, -2 ]
	},
	mixed: {
		url: 'https://wikimedia.gerrit.org',
		title: 'An open patch with a bunch of mixed reviews',
		status: 'NEW',
		codeReviewScore: [ -2, -1, 0, 1, 2 ]
	},
	mixed2: {
		url: 'https://wikimedia.gerrit.org',
		title: '[WIP], marked as -2 on purpose, but other people like it',
		status: 'NEW',
		codeReviewScore: [ -2, 1 ]
	},
	mixed3: {
		url: 'https://wikimedia.gerrit.org',
		title: 'Well this seems contentious.',
		status: 'NEW',
		codeReviewScore: [ 1, 1, 2, -2 ]
	}
};

export default pherritData;
