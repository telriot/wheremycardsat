import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IDeckBuilderInitialState, IStore } from "../../declarations/index";
import { trimName, normalizeCard } from "../../lib/helpers";
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
				const cardQuantity = quantities[trimmedName] || { quantity: 1 };
				quantities[trimmedName] = {
					...normalizedCard,
					...cardQuantity,
					availability: quantities[trimmedName]
						? quantities[trimmedName].quantity
						: 1,
				};
			});
			//Fix bug with non parsed card names
			Object.keys(quantities).forEach(
				(key) => !quantities[key].name && delete quantities[key]
			);

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
			const cardname = trimName(state.searchResult.name);
			if (state.mainDeckList[cardname]) {
				state.mainDeckList[cardname].quantity++;
				state.mainDeckList[cardname].availability++;
			} else {
				state.mainDeckList[cardname] = {
					...state.searchResult,
					quantity: 1,
					availability: 1,
				};
			}
			state.mainDeckLength++;
		},
		cardQuantityIncreased: (state, action) => {
			const { cardname, quantity } = action.payload;
			const trimmedName = trimName(cardname);
			state.mainDeckList[trimmedName].quantity += quantity;
			state.mainDeckList[trimmedName].availability += quantity;

			state.mainDeckLength += quantity;
		},
		cardQuantityDecreased: (state, action) => {
			const { cardname, quantity } = action.payload;
			const trimmedName = trimName(cardname);

			if (state.mainDeckList[trimmedName].quantity <= quantity) {
				state.mainDeckLength -= state.mainDeckList[trimmedName].quantity;
				delete state.mainDeckList[trimmedName];
			} else {
				state.mainDeckList[trimmedName].quantity -= quantity;
				state.mainDeckList[trimmedName].availability -= quantity;
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
