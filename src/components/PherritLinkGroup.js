import css from './PherritLinkGroup.css'; // eslint-disable-line

class PherritLinkGroup {
	constructor( groupName, pherritLinks ) {
		this.string = this.template( groupName, pherritLinks );
	}

	template( groupName, pherritLinks ) {

		return `
	<details class="pherrit-group pherrit-group--status-${groupName}">
		<summary class="pherrit-group__summary">
			${pherritLinks.length}
			<span class="pherrit-group__group-name">${groupName}</span>
			patches
		</summary>
	${ pherritLinks.reduce( ( string, link ) => {
		string += link.string;
		return string;
	}, '' ) }
	</details>
		`;
	}
}

export default PherritLinkGroup;
