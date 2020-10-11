import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IDeckBuilderInitialState, IStore } from "../../declarations/index";
import axios from "axios";

const initialState: IDeckBuilderInitialState = {
	error: "",
	searchStatus: "idle",
	saveStatus: "idle",
	fetchCollectionStatus: "idle",
	searchResult: undefined,
	mainDeckList: {},
	mainDeckLength: 0,
	deckName: "",
	deckFormat: "",
};
const trimName = (name: string) => {
	const [partial, _] = name.split("//");
	const trimmedName = partial.replace(`"`, "").trim();
	return trimmedName;
};
const normalizeCard = (card: any) => {
	const hasFaces = Boolean(card.card_faces !== undefined);
	const hasImageUris = Boolean(card.image_uris !== undefined);
	const hasBothManaCosts = Boolean(
		hasFaces &&
			card.card_faces[0].mana_cost.length &&
			card.card_faces[1].mana_cost.length
	);
	let cardObj = {
		name: card.name,
		mana_cost: hasFaces
			? hasBothManaCosts
				? card.card_faces[0].mana_cost + "/" + card.card_faces[1].mana_cost
				: card.card_faces[0].mana_cost
			: card.mana_cost,
		image_uris:
			hasFaces && !hasImageUris
				? card.card_faces.map((face: any) => ({
						small: face.image_uris.small,
						normal: face.image_uris.normal,
				  }))
				: {
						small: card.image_uris.small,
						normal: card.image_uris.normal,
				  },
		type_line: card.type_line,
	};
	return cardObj;
};
export const fetchIndividualCard = createAsyncThunk(
	"deckBuilder/fetchIndividualCard",
	async (name: string, thunkAPI) => {
		try {
			const response = await axios.get(
				`https://api.scryfall.com/cards/named?exact=${name}`
			);
			const card = normalizeCard(response.data);
			return { card, success: true, error: "" };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const fetchCardCollection = createAsyncThunk(
	"deckBuilder/fetchCardCollection",
	async ({ collection, quantities }: any, thunkAPI) => {
		console.log("COLLECTION", collection[0]);
		const requests = collection.map((chunk: any, index: number) =>
			axios.post(
				`https://api.scryfall.com/cards/collection`,
				JSON.stringify(chunk),
				{ headers: { "Content-Type": "application/json" } }
			)
		);

		try {
			const response: any = await axios.all(requests);
			const data: Array<any> =
				response.length > 1
					? response.reduce((a: any, b: any) => a.data.data.concat(b.data.data))
					: response[0].data.data;

			data.forEach((card: any) => {
				const trimmedName = trimName(card.name);
				const normalizedCard = normalizeCard(card);
				quantities[trimmedName] = {
					...normalizedCard,
					...quantities[trimmedName],
				};
			});
			return { decklist: quantities, success: true, error: "" };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const saveDeckList = createAsyncThunk(
	"deckBuilder/saveDeckList",
	async (
		{ deckList, name, format }: { deckList: any; name: string; format: string },
		thunkAPI: { dispatch: any; getState: () => any }
	) => {
		const auth = thunkAPI.getState().auth;
		try {
			const response = await axios.post(`/api/decks/${auth.user._id}`, {
				deckList,
				name,
				format,
			});
			console.log(response);

			return { success: true, error: "" };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);

const deckBuilderSlice = createSlice({
	name: "deckBuilder",
	initialState,

	reducers: {
		cardAdded: (state) => {
			const cardName = trimName(state.searchResult.name);
			if (state.mainDeckList[cardName]) {
				state.mainDeckList[cardName].quantity++;
			} else {
				state.mainDeckList[cardName] = { ...state.searchResult, quantity: 1 };
			}
			state.mainDeckLength++;
		},
		cardQuantityIncreased: (state, action) => {
			const { cardName, quantity } = action.payload;
			const trimmedName = trimName(cardName);
			state.mainDeckList[trimmedName].quantity += quantity;
			state.mainDeckLength += quantity;
		},
		cardQuantityDecreased: (state, action) => {
			const { cardName, quantity } = action.payload;
			const trimmedName = trimName(cardName);

			if (state.mainDeckList[trimmedName].quantity <= quantity) {
				state.mainDeckLength -= state.mainDeckList[trimmedName].quantity;
				delete state.mainDeckList[trimmedName];
			} else {
				state.mainDeckList[trimmedName].quantity -= quantity;
				state.mainDeckLength -= quantity;
			}
		},
		deckNameChanged: (state, action) => {
			state.deckName = action.payload;
		},
		formatChanged: (state, action) => {
			state.deckFormat = action.payload;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(fetchIndividualCard.pending, (state, action) => {
			state.searchStatus = "pending";
		});
		builder.addCase(fetchIndividualCard.fulfilled, (state, action) => {
			state.searchResult = action.payload.card;
			state.searchStatus = "fulfilled";
		});
		builder.addCase(fetchIndividualCard.rejected, (state, action) => {
			state.searchStatus = "rejected";
			console.log(action);
			state.error = "Something went wrong with our servers";
		});
		builder.addCase(fetchCardCollection.pending, (state, action) => {
			state.fetchCollectionStatus = "pending";
		});
		builder.addCase(fetchCardCollection.fulfilled, (state, action) => {
			state.mainDeckList = action.payload.decklist;
			console.log("decklist payload", action.payload.decklist);
			state.mainDeckLength = Object.values(action.payload.decklist).reduce(
				(a: number, b: any) => {
					const quantityB: number = ~~b.quantity;
					return a + quantityB;
				},
				0
			);
			state.fetchCollectionStatus = "fulfilled";
		});
		builder.addCase(fetchCardCollection.rejected, (state, action) => {
			state.fetchCollectionStatus = "rejected";
			console.log(action);
			state.error = "Something went wrong with our servers";
		});
		builder.addCase(saveDeckList.pending, (state, action) => {
			state.saveStatus = "pending";
		});
		builder.addCase(saveDeckList.fulfilled, (state, action) => {
			state.saveStatus = "fulfilled";
		});
		builder.addCase(saveDeckList.rejected, (state, action) => {
			state.saveStatus = "rejected";
			console.log(action);
			state.error = "Something went wrong with our servers";
		});
	},
});

export const {
	cardAdded,
	cardQuantityIncreased,
	cardQuantityDecreased,
	deckNameChanged,
	formatChanged,
} = deckBuilderSlice.actions;

export const selectDeckName = (state: IStore) => state.deckBuilder.deckName;
export const selectDeckFormat = (state: IStore) => state.deckBuilder.deckFormat;
export const selectSearchStatus = (state: IStore) =>
	state.deckBuilder.searchStatus;
export const selectSaveStatus = (state: IStore) => state.deckBuilder.saveStatus;
export const selectSearchResult = (state: IStore) =>
	state.deckBuilder.searchResult;
export const selectMainDeckLength = (state: IStore) =>
	state.deckBuilder.mainDeckLength;
export const selectMainDeckList = (state: IStore) =>
	state.deckBuilder.mainDeckList;

export default deckBuilderSlice.reducer;
