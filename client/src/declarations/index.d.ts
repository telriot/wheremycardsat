export type TStatus = "idle" | "pending" | "fulfilled" | "rejected";
export type TTimeframe = "day" | "week" | "month" | "all" | "archived";

export interface ICard {
	name: string;
	mana_cost: string[];
	image_uris: Array<{ small: string; normal: string; art_crop?: string }>;
	type_line: string;
	quantity: number;
	availability: number;
}
export interface IDeck {
	_id: string;
	name: string;
	format: string;
	deckList: any;
}
export interface IRouteParams {
	id: string;
}
export type TSortOrder = "name" | "manacost";

export interface ISharedCard {
	deckID: string;
	deckName: string;
	quantity: number;
	availability: number;
}
export interface IUser {
	_id: string;
	username: string;
	email?: string;
	screeName?: string;
	twitterId?: string;
	profileImageUrl?: string;
	createdEvents?: any;
	joinedEvents?: any;
}

//STATE DECLARATIONS
export interface IAuthInitialState {
	user: null | IUser;
	isAuth: boolean;
	status: TStatus;
	error: string;
	successMessage: string;
	authDialogIsOpen: boolean;
	authDialogActiveTab: number;
	userToUpdate: string;
	passwordResetStatus: TStatus;
	passwordResetError: string;
}
export interface IDeckBuilderInitialState {
	searchStatus: TStatus;
	saveStatus: TStatus;
	fetchCollectionStatus: TStatus;
	error: string;
	searchResult: any;
	mainDeckList: any;
	mainDeckLength: number;
	deckName: string;
	deckFormat: string;
}
export interface IMyDecksInitialState {
	status: TStatus;
	decksStatus: TStatus;
	singleCardEditStatus: TStatus;
	beingEdited: string;
	error: string;
	decks: Array<any>;
	onlyShared: boolean;
}

export interface IUsersInitialState {
	userPersonalProfile: IUser | null;
	status: TStatus;
	updateStatus: TStatus;
	eventsSelection: "myEvents" | "joined" | "archived";
	error: string;
}

export interface IStore {
	auth: IAuthInitialState;
	users: IUsersInitialState;
	deckBuilder: IDeckBuilderInitialState;
	myDecks: IMyDecksInitialState;
}
