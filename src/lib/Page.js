/**
 * Class that abstracts the Phabricator DOM elements
 */
class Page {
	get cards() {
		return document.querySelectorAll( '[data-sigil~="project-card"]' );
	}

	get ticketNumbers() {
		const cardArray = Array.from( this.cards );
		return cardArray.map( ( card ) => {
			return this.getTicketNumberFromCard( card );
		} );
	}

	get cardMap() {
		const cardArray = Array.from( this.cards );
		return cardArray.reduce( ( cardObj, card ) => {
			const num = this.getTicketNumberFromCard( card );
			cardObj[ num ] = card;
			return cardObj;
		}, {} );
	}

	getTicketNumberFromCard( cardDOM ) {
		return cardDOM.querySelector( '.phui-oi-objname' ).innerHTML;
	}
}

export default Page;
