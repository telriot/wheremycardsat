import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import deckBuilderReducer from "../features/deckBuilder/deckBuilderSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    deckBuilder:deckBuilderReducer,
  },
});
