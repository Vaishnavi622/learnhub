
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import coursesReducer from './slices/coursesSlice.js';
import usersReducer from "./slices/usersSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    users: usersReducer,
  },
});
