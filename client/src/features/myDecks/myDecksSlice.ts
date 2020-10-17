import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ICard, IMyDecksInitialState, IStore } from "../../declarations/index";
import axios from "axios";

const initialState: IMyDecksInitialState = {
	status: "idle",
	addCardStatus: "idle",
	decksStatus: "idle",
	singleCardEditStatus: "idle",
	beingEdited: "",
	error: "",
	decks: [],
	onlyShared: false,
};
interface ISwapObj {
	deckID: string;
	cardname: string;
	availability: number;
}
interface IDeckUpdateObj {
	deckID: string;
	update: { cardname: string; quantity?: number; availability?: number };
}
interface IAddCardObj {
	deckID: string;
	cardObj: ICard;
}

interface IRemoveCardObj {
	deckID: string;
	cardname: string;
}

export const fetchMyDecks = createAsyncThunk(
	"myDecks/fetchMyDecks",
	async (_, thunkAPI: { dispatch: any; getState: () => any }) => {
		const auth = thunkAPI.getState().auth;
		try {
			const response = await axios.get(`/api/users/${auth.user._id}/decks`);
			const decks = response.data;
			return { decks, success: true, error: "" };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const deleteDeck = createAsyncThunk(
	"myDecks/deleteDeck",
	async (deckID: string, thunkAPI: { dispatch: any; getState: () => any }) => {
		try {
			const response = await axios.delete(`/api/decks/${deckID}`);
			const decks = response.data.updatedDecks;
			return { success: true, error: "", decks };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const updateDeck = createAsyncThunk(
	"myDecks/updateDeck",
	async (
		{ deckID, update }: IDeckUpdateObj,
		thunkAPI: { dispatch: any; getState: () => any }
	) => {
		try {
			const response = await axios.put(`/api/decks/${deckID}`, update);
			const decks = response.data.updatedDecks;
			return { success: true, error: "", decks };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const addCardToDeck = createAsyncThunk(
	"myDecks/addCardToDeck",
	async (
		{ deckID, cardObj }: IAddCardObj,
		thunkAPI: { dispatch: any; getState: () => any }
	) => {
		try {
			const response = await axios.post(
				`/api/decks/${deckID}/addCard`,
				cardObj
			);
			const decks = response.data.updatedDecks;
			console.log(decks);
			return { success: true, error: "", decks };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);

export const removeCardFromDeck = createAsyncThunk(
	"myDecks/removeCardFromDeck",
	async (
		{ deckID, cardname }: IRemoveCardObj,
		thunkAPI: { dispatch: any; getState: () => any }
	) => {
		try {
			const response = await axios.post(`/api/decks/${deckID}/removeCard`, {
				cardname,
			});
			const decks = response.data.updatedDecks;
			console.log(decks);
			return { success: true, error: "", decks };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);
export const moveCardsBetweenDecks = createAsyncThunk(
	"myDecks/moveCardsBetweenDecks",
	async (
		updates: Array<ISwapObj>,
		thunkAPI: { dispatch: any; getState: () => any }
	) => {
		const auth = thunkAPI.getState().auth;
		const updateObj = { authorID: auth.user._id, updates };
		try {
			const response = await axios.post(`/api/decks/swap/`, updateObj);
			const decks = response.data.updatedDecks;
			return { success: true, error: "", decks };
		} catch (error) {
			console.error(error);
			return { error };
		}
	}
);

const myDecksSlice = createSlice({
	name: "myDecks",
	initialState,
	reducers: {
		onlySharedToggled: (state, action) => {
			state.onlyShared = action.payload;
		},
		isEditingSingleToggled: (state, action) => {
			state.beingEdited = action.payload;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(fetchMyDecks.pending, (state, action) => {
			state.decksStatus = "pending";
		});
		builder.addCase(fetchMyDecks.fulfilled, (state, action) => {
			state.decks = action.payload.decks;
			state.decksStatus = "fulfilled";
		});
		builder.addCase(fetchMyDecks.rejected, (state, action) => {
			state.decksStatus = "rejected";
			console.log(action);
			state.error = "Something went wrong with our servers";
		});
		builder.addCase(deleteDeck.pending, (state, action) => {
			state.status = "pending";
		});
		builder.addCase(deleteDeck.fulfilled, (state, action) => {
			state.decks = action.payload.decks;
			state.status = "fulfilled";
		});
		builder.addCase(deleteDeck.rejected, (state, action) => {
			state.status = "rejected";
			state.error = "Something went wrong with our servers";
		});
		builder.addCase(moveCardsBetweenDecks.pending, (state, action) => {
			state.status = "pending";
		});
		builder.addCase(moveCardsBetweenDecks.fulfilled, (state, action) => {
			state.decks = action.payload.decks;
			state.status = "fulfilled";
			state.beingEdited = "";
		});
		builder.addCase(moveCardsBetweenDecks.rejected, (state, action) => {
			state.status = "rejected";
			state.error = "Something went wrong with our servers";
			state.beingEdited = "";
		});
		builder.addCase(addCardToDeck.pending, (state, action) => {
			state.addCardStatus = "pending";
		});
		builder.addCase(addCardToDeck.fulfilled, (state, action) => {
			state.decks = action.payload.decks;
			state.addCardStatus = "fulfilled";
		});
		builder.addCase(addCardToDeck.rejected, (state, action) => {
			state.addCardStatus = "rejected";
			state.error = "Something went wrong with our servers";
		});
		builder.addCase(removeCardFromDeck.pending, (state, action) => {
			state.status = "pending";
		});
		builder.addCase(removeCardFromDeck.fulfilled, (state, action) => {
			state.decks = action.payload.decks;
			state.status = "fulfilled";
			state.beingEdited = "";
		});
		builder.addCase(removeCardFromDeck.rejected, (state, action) => {
			state.status = "rejected";
			state.error = "Something went wrong with our servers";
			state.beingEdited = "";
		});
		builder.addCase(updateDeck.pending, (state, action) => {
			state.status = "pending";
		});
		builder.addCase(updateDeck.fulfilled, (state, action) => {
			state.decks = action.payload.decks;
			state.status = "fulfilled";
			state.beingEdited = "";
		});
		builder.addCase(updateDeck.rejected, (state, action) => {
			state.status = "rejected";
			state.error = "Something went wrong with our servers";
			state.beingEdited = "";
		});
	},
});

export const {
	onlySharedToggled,
	isEditingSingleToggled,
} = myDecksSlice.actions;
export const selectMyDecks = (state: IStore) => state.myDecks.decks;
export const selectOnlyShared = (state: IStore) => state.myDecks.onlyShared;
export const selectDecksStatus = (state: IStore) => state.myDecks.decksStatus;
export const selectAddCardStatus = (state: IStore) =>
	state.myDecks.addCardStatus;
export const selectBeingEdited = (state: IStore) => state.myDecks.beingEdited;
export default myDecksSlice.reducer;
