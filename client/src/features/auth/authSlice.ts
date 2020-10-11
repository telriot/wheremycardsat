import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IAuthInitialState, IStore } from "../../declarations/index";
import axios from "axios";

const initialState: IAuthInitialState = {
	user: null,
	isAuth: false,
	error: "",
	status: "idle",
	successMessage: "",
	authDialogIsOpen: false,
	authDialogActiveTab: 0,
	userToUpdate: "",
	passwordResetStatus: "idle",
	passwordResetError: "",
};

export const fetchAuthState = createAsyncThunk(
	"auth/fetchAuthState",
	async () => {
		try {
			const response = await axios.get("/api/auth/login/success");
			const { success, user } = response.data;
			return { success, user, error: "" };
		} catch (error) {
			return { success: false, user: null, error };
		}
	}
);
export const attemptLogin = createAsyncThunk(
	"auth/attemptLogin",
	async (authObj: { username: string; password: string }, thunkAPI) => {
		try {
			const response = await axios.post("/api/auth/login", authObj);
			const { success, user } = response.data;
			return { success, user, error: "" };
		} catch (error) {
			return { success: false, user: initialState.user, error };
		}
	}
);
export const attemptSignup = createAsyncThunk(
	"auth/attemptSignup",
	async (
		authObj: { username: string; password: string; email: string },
		thunkAPI
	) => {
		try {
			const response = await axios.post("/api/auth/signup", authObj);
			const { success, user, message } = response.data;
			if (!success) return { message };
			return { success, user, error: "" };
		} catch (error) {
			console.log(error);
			return { success: false, user: initialState.user, error };
		}
	}
);
export const postLogout = createAsyncThunk("auth/postLogout", async () => {
	try {
		await axios.post("/api/auth/logout");
		return { success: true, message: "Logout successful" };
	} catch (error) {
		return { success: false, error };
	}
});
export const requestPasswordReset = createAsyncThunk(
	"auth/requestPasswordReset",
	async (dataObj: { email: string }, thunkAPI) => {
		try {
			await axios.post("/api/auth/reset", dataObj);
			return { success: true, message: "Reset procedure initiated" };
		} catch (error) {
			return { success: false, error };
		}
	}
);
export const getUserToUpdate = createAsyncThunk(
	"auth/getUserToUpdate",
	async (token: string, thunkAPI) => {
		try {
			const response = await axios.get(`/api/auth/reset/${token}`);
			const { username } = response.data;
			return { success: true, username };
		} catch (error) {
			return { success: false, error };
		}
	}
);
export const updateCredentials = createAsyncThunk(
	"auth/updateCredentials",
	async (
		dataObj: { password: string },
		thunkAPI: { dispatch: any; getState: Function }
	) => {
		const state = thunkAPI.getState().auth;
		try {
			await axios.put("/api/auth/updatePassword", {
				...dataObj,
				username: state.userToUpdate,
			});
			return { success: true, message: "Password Updated" };
		} catch (error) {
			return { success: false, error: error };
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		openedAuthDialog: (state) => {
			state.authDialogIsOpen = true;
			state.error = "";
		},
		closedAuthDialog: (state) => {
			state.authDialogIsOpen = false;
			state.error = "";
		},
		setAuthDialogTab: (state, action) => {
			state.authDialogActiveTab = action.payload;
			state.error = "";
		},
		clearedAuthErrors: (state) => {
			state.error = "";
		},
		clearedSignupMessage: (state) => {
			state.successMessage = "";
		},
		clearedPasswordResetStatus: (state) => {
			state.passwordResetStatus = "idle";
		},
		clearedPasswordResetError: (state) => {
			state.passwordResetError = "";
		},
	},
	extraReducers: (builder) => {
		//FETCH AUTH STATE
		builder.addCase(fetchAuthState.fulfilled, (state, action) => {
			const { success, user, error } = action.payload;
			state.isAuth = success;
			state.user = user;
			state.error = error;
		});
		builder.addCase(fetchAuthState.rejected, (state, action) => {
			state.isAuth = false;
			state.user = null;
			state.error = "Something went wrong with our servers";
		});
		//ATTEMPT LOGIN
		builder.addCase(attemptLogin.pending, (state, action) => {
			state.status = "pending";
			state.error = "";
		});
		builder.addCase(attemptLogin.fulfilled, (state, action) => {
			const { success, user } = action.payload;
			if (success) {
				state.authDialogIsOpen = false;
				state.error = "";
			} else {
				state.error = "Invalid Credentials";
			}
			state.isAuth = success;
			state.user = user ? user : initialState.user;

			state.status = "idle";
		});
		builder.addCase(attemptLogin.rejected, (state, action) => {
			state.isAuth = false;
			state.user = initialState.user;
			state.error = "Something went wrong with our servers";
			state.status = "idle";
		});
		//ATTEMPT SIGNUP
		builder.addCase(attemptSignup.pending, (state, action) => {
			state.status = "pending";
			state.error = "";
		});
		builder.addCase(attemptSignup.fulfilled, (state, action) => {
			const { success, message } = action.payload;
			if (success) {
				state.authDialogActiveTab = 0;
				state.successMessage = "Signup successful. You can now login";
				state.error = "";
			} else {
				state.error = message;
			}
			state.status = "idle";
		});

		builder.addCase(attemptSignup.rejected, (state, action) => {
			console.log(action);
			state.isAuth = false;
			state.user = initialState.user;
			state.error = "Something went wrong with our servers.";
			state.status = "idle";
		});
		//REQUEST PASSWORD RESET
		builder.addCase(requestPasswordReset.pending, (state, action) => {
			state.passwordResetStatus = "pending";
			state.passwordResetError = "";
		});
		builder.addCase(requestPasswordReset.fulfilled, (state, action) => {
			const { success } = action.payload;
			if (success) {
				state.passwordResetStatus = "fulfilled";
			} else {
				state.passwordResetStatus = "idle";
				state.passwordResetError = "Email address not registered";
			}
		});
		builder.addCase(requestPasswordReset.rejected, (state, action) => {
			state.userToUpdate = "";
			state.passwordResetError = "Something went wrong with our servers";
			state.passwordResetStatus = "rejected";
		});
		//GET USER TO UPDATE
		builder.addCase(getUserToUpdate.pending, (state, action) => {
			state.status = "pending";
			state.passwordResetError = "";
		});
		builder.addCase(getUserToUpdate.fulfilled, (state, action) => {
			const { success, username } = action.payload;
			if (success) {
				state.userToUpdate = username;
				state.passwordResetError = "";
			} else {
				state.passwordResetError = "This token goes nowhere";
			}
			state.status = "idle";
		});
		builder.addCase(getUserToUpdate.rejected, (state, action) => {
			state.userToUpdate = "";
			state.passwordResetError = "Something went wrong with our servers";
			state.status = "idle";
		});
		//UPDATE CREDENTIALS
		builder.addCase(updateCredentials.pending, (state, action) => {
			state.passwordResetStatus = "pending";
			state.passwordResetError = "";
		});
		builder.addCase(updateCredentials.fulfilled, (state, action) => {
			const { success } = action.payload;
			if (success) {
				state.passwordResetStatus = "fulfilled";
			} else {
				state.passwordResetStatus = "idle";
				state.passwordResetError = "Uhmm... something went wrong.";
			}
		});
		builder.addCase(updateCredentials.rejected, (state, action) => {
			state.userToUpdate = "";
			state.passwordResetError = "Something went wrong with our servers";
			state.passwordResetStatus = "rejected";
		});
	},
});
export const {
	openedAuthDialog,
	closedAuthDialog,
	setAuthDialogTab,
	clearedAuthErrors,
	clearedSignupMessage,
	clearedPasswordResetStatus,
	clearedPasswordResetError,
} = authSlice.actions;
export const selectAuthStatus = (state: IStore) => state.auth.status;
export const selectAuthDialogActiveTab = (state: IStore) =>
	state.auth.authDialogActiveTab;
export const selectAuthDialogIsOpen = (state: IStore) =>
	state.auth.authDialogIsOpen;
export const selectAuthorizedUser = (state: IStore) => state.auth.user;
export const selectSignupMessage = (state: IStore) => state.auth.successMessage;
export const selectErrorMessage = (state: IStore) => state.auth.error;
export const selectUserToUpdate = (state: IStore) => state.auth.userToUpdate;
export const selectPasswordResetStatus = (state: IStore) =>
	state.auth.passwordResetStatus;
export const selectPasswordResetError = (state: IStore) =>
	state.auth.passwordResetError;
export default authSlice.reducer;
