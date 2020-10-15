export class SharedDataObj {
	deckID: string;
	deckName: string;
	quantity: number;
	availability: number;
	constructor(
		deckID: string = "",
		deckName: string = "",
		quantity: number = 0,
		availability: number = 0
	) {
		this.deckID = deckID;
		this.deckName = deckName;
		this.quantity = quantity;
		this.availability = availability;
	}
}
