import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    resume: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setResume: (state, action) => {
      state.resume = action.payload;
    },
  },
});

export const { setLoading, setUser, setResume } = authSlice.actions;

export default authSlice.reducer;
