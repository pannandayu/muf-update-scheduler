import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authentication",
  initialState: {
    username: "",
    role: "",
    token: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export const authSliceActions = authSlice.actions;
export default store;
