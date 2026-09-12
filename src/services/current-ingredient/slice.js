import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ingredient: null,
};

export const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,

  reducers: {
    setCurrentIngredient: (state, action) => {
      state.ingredient = action.payload;
    },

    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    },
  },

  selectors: {
    getCurrentIngredient: (state) => state.ingredient,
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;

export const { getCurrentIngredient } = currentIngredientSlice.selectors;
