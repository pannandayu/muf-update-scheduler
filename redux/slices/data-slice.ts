import { createSlice } from "@reduxjs/toolkit";
import { pushUpdateThunk } from "../thunks";
import { PushUpdateDataReturn } from "@/types/Monitor";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    current: {
      data: {
        message: "",
        currentData: [],
        dateTime: "",
        size: 0,
      },
    } as PushUpdateDataReturn["current"],
    record: {
      data: [],
      size: 0,
    } as PushUpdateDataReturn["record"],
    error: {
      message: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(pushUpdateThunk.fulfilled, (state, action) => {
      state.current = action.payload.current;
      state.record = action.payload.record;
    });

    builder.addCase(pushUpdateThunk.rejected, (state, action) => {
      state.error.message = action.error.message || "Pushing update rejected";
    });
  },
});

export const dataSliceActions = dataSlice.actions;
