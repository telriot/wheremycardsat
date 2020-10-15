import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IStore, IUsersInitialState } from "../../declarations/index";
import axios from "axios";

const initialState: IUsersInitialState = {
	userPersonalProfile: null,
	status: "idle",
	updateStatus: "idle",
	eventsSelection: "myEvents",
	error: "",
};

export const fetchPersonalProfile = createAsyncThunk(
	"users/fetchPersonalProfile",
	async (id: string | undefined, thunkAPI) => {
		try {
			const response = await axios.get(`/api/users/${id}`);
			return { personalProfile: response.data };
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	}
);
export const updatePersonalProfile = createAsyncThunk(
	"users/updatePersonalProfile",
	async (
		{ id, dataObj }: { id: string | undefined; dataObj: any },
		thunkAPI
	) => {
		try {
			const response = await axios.put(`/api/users/${id}`, { dataObj });
			return { updatedProfile: response.data };
		} catch (error) {
			console.log(error);
			return { success: false, error: error.message };
		}
	}
);

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchPersonalProfile.pending, (state, action) => {
			state.status = "pending";
		});
		builder.addCase(fetchPersonalProfile.fulfilled, (state, action) => {
			const { personalProfile } = action.payload;
			state.userPersonalProfile = personalProfile;
			state.status = "fulfilled";
		});
		builder.addCase(fetchPersonalProfile.rejected, (state, action) => {
			state.status = "rejected";
			state.error = "Something went wrong with our servers";
		});
		builder.addCase(updatePersonalProfile.pending, (state, action) => {
			state.updateStatus = "pending";
		});
		builder.addCase(updatePersonalProfile.fulfilled, (state, action) => {
			const { updatedProfile } = action.payload;
			state.userPersonalProfile = updatedProfile;
			state.updateStatus = "fulfilled";
		});
		builder.addCase(updatePersonalProfile.rejected, (state, action) => {
			state.updateStatus = "rejected";
			state.error = "Something went wrong with our servers";
		});
	},
});
export const selectPersonalProfile = (state: IStore) =>
	state.users.userPersonalProfile;
export const selectPersonalProfileStatus = (state: IStore) =>
	state.users.status;
export const selectPersonalProfileUpdateStatus = (state: IStore) =>
	state.users.updateStatus;
export const selectPersonalProfileError = (state: IStore) => state.users.error;

export const {} = usersSlice.actions;
export default usersSlice.reducer;
