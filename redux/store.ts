import { dataSlice } from "./slices/data-slice";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    data: dataSlice.reducer,
  },
});

export default store;
