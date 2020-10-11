import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IDeckBuilderInitialState, IStore } from "../../declarations/index";
import axios from "axios";

const initialState: IDeckBuilderInitialState = {
	error: "",
	searchStatus: "idle",
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
export const fetchIndividualCard = createAsyncThunk(
	"deckBuilder/fetchIndividualCard",
	async (name: string, thunkAPI) => {
		try {
			console.log("response");
			const response = await axios.get(
				`https://api.scryfall.com/cards/named?exact=${name}`
			);
			console.log(response);

			return { card: response.data, success: true, error: "" };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const fetchCardCollection = createAsyncThunk(
	"deckBuilder/fetchCardCollection",
	async ({ collection, quantities }: any, thunkAPI) => {
		try {
			const response = await axios.post(
				`https://api.scryfall.com/cards/collection`,
				JSON.stringify(collection),
				{ headers: { "Content-Type": "application/json" } }
			);
			const { data } = response.data;

			data.forEach((card: any) => {
				const trimmedName = trimName(card.name);
				quantities[trimmedName] = { ...card, ...quantities[trimmedName] };
			});

			return { decklist: quantities, success: true, error: "" };
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
			state.searchStatus = "pending";
		});
		builder.addCase(fetchCardCollection.fulfilled, (state, action) => {
			state.mainDeckList = action.payload.decklist;
			state.searchStatus = "fulfilled";
		});
		builder.addCase(fetchCardCollection.rejected, (state, action) => {
			state.searchStatus = "rejected";
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
export const selectSearchResult = (state: IStore) =>
	state.deckBuilder.searchResult;
export const selectMainDeckList = (state: IStore) =>
	state.deckBuilder.mainDeckList;

export default deckBuilderSlice.reducer;
