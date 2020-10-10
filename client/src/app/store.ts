import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
});
