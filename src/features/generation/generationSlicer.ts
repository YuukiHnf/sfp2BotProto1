import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type Generation = {
  generation: string;
};

const initialState: Generation = {
  generation: "First",
};

export const generationSlice = createSlice({
  name: "generation",
  initialState,
  reducers: {
    changeGeneration: (state, action) => {
      state.generation = action.payload;
    },
  },
});

export const { changeGeneration } = generationSlice.actions;

export const selectGeneration = (state: RootState) =>
  state?.generation.generation;

export default generationSlice.reducer;
