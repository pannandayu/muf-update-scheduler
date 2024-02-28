import { monitorThunk } from "@/redux/thunks";
import { createSlice } from "@reduxjs/toolkit";
import { pushUpdateThunk } from "../thunks";
import { PushUpdateDataReturn, UpdateDataRecord } from "@/interfaces/IMonitor";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    current: {
      data: {
        message: "",
        list: [],
        dateTime: "",
        size: 0,
      },
    } as PushUpdateDataReturn["current"],
    record: {
      data: [],
      size: 0,
    } as UpdateDataRecord["record"],
    error: {
      message: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(pushUpdateThunk.fulfilled, (state, action) => {
      state.current = action.payload.current;
    });
    builder.addCase(monitorThunk.fulfilled, (state, action) => {
      state.record = action.payload.record;
    });

    builder.addCase(monitorThunk.rejected, (state, action) => {
      state.error.message =
        action.error.message || "Get monitoring data rejected";
    });
    builder.addCase(pushUpdateThunk.rejected, (state, action) => {
      state.error.message = action.error.message || "Pushing update rejected";
    });
  },
});

export const dataSliceActions = dataSlice.actions;
