module.exports = [
	{
		tracking_ids: [ { // eslint-disable-line
			system: 'Phab',
			id: 'T12345'
		} ],
		subject: 'Patch subject ladida',
		project: 'repo_name',
		_number: 'patch_number_12345',
		status: 'NEW',
		labels: {
			'Code-Review': {
				all: [
					{ value: 1 },
					{ value: 2 },
					{ value: -1 }
				]
			}
		}
	}
];
