import { accessThunk, loginThunk } from "@/redux/thunks";
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    message: "",
    username: "",
    role: "",
    token: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      const { message, username, role, token } = action.payload;
      state.message = message;
      state.username = username!;
      state.role = role!;
      state.token = token!;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.message = action.error.message || "Login rejected";
    });
    builder.addCase(accessThunk.rejected, (state, action) => {
      state.message = action.error.message || "Access rejected";
    });
  },
});

export const authSliceActions = authSlice.actions;
