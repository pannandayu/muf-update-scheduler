import { loginThunk, signupThunk } from "@/redux/thunks";
import { createSlice } from "@reduxjs/toolkit";

const defaultLoginValue = {
  message: "",
  username: "",
  role: "",
  token: "",
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    login: defaultLoginValue,
    signup: {
      message: "",
    },
  },
  reducers: {
    logout: (state) => {
      state.login = defaultLoginValue;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      const { message, username, role, token } = action.payload;
      state.login.message = message;
      state.login.username = username!;
      state.login.role = role!;
      state.login.token = token!;
    });
    builder.addCase(signupThunk.fulfilled, (state, action) => {
      state.signup.message = action.payload.message;
    });

    builder.addCase(loginThunk.rejected, (state, action) => {
      state.login.message = action.error.message || "Login rejected";
    });
    builder.addCase(signupThunk.rejected, (state, action) => {
      state.signup.message = action.error.message || "Signup rejected";
    });
  },
});

export const authSliceActions = authSlice.actions;
