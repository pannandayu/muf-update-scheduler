import moment from "moment";
import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    date: moment(new Date()).format("DD-MM-YYYY"),
  },
  reducers: {
    setDate(state, action) {
      state.date = action.payload;
    },
  },
});

export const dataSliceActions = dataSlice.actions;
