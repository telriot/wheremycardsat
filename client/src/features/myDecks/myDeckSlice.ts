import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IMyDecksInitialState, IStore } from "../../declarations/index";
import axios from "axios";

const initialState: IMyDecksInitialState = {
	status: "idle",
	error: "",
};

const myDecksSlice = createSlice({
	name: "myDecks",
	initialState,

	reducers: {},

	extraReducers: (builder) => {},
});

export const {} = myDecksSlice.actions;

export default myDecksSlice.reducer;
