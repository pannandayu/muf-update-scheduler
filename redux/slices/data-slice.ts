import moment from "moment";
import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    // current: {
    //   data: {
    //     message: "",
    //     list: [],
    //     dateTime: "",
    //     size: 0,
    //   },
    // }, //as PushUpdateDataReturn["current"],
    // record: {
    //   data: [],
    //   size: 0,
    // }, //as UpdateDataRecord["record"],
    // error: {
    //   message: "",
    // },
    date: moment(new Date()).format("DD-MM-YYYY"),
  },
  reducers: {
    setDate(state, action) {
      state.date = action.payload;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(pushUpdateThunk.fulfilled, (state, action) => {
    //   state.current = action.payload.current;
    // });
    // builder.addCase(monitorThunk.fulfilled, (state, action) => {
    //   state.record = action.payload.record;
    // });
    // builder.addCase(getBatchDataThunk.fulfilled, (state, action) => {
    //   state.current.data = action.payload.data!;
    // });
    // builder.addCase(monitorThunk.rejected, (state, action) => {
    //   state.error.message =
    //     action.error.message || "Get monitoring data rejected";
    // });
    // builder.addCase(pushUpdateThunk.rejected, (state, action) => {
    //   state.error.message = action.error.message || "Pushing update rejected";
    // });
    // builder.addCase(getBatchDataThunk.rejected, (state, action) => {
    //   state.error.message =
    //     action.error.message || "Get batch update data rejected";
    // });
  },
});

export const dataSliceActions = dataSlice.actions;
