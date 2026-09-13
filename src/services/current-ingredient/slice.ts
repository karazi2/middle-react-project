import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from '@/types';

type CurrentIngredientState = {
  ingredient: Ingredient | null;
};

const initialState: CurrentIngredientState = {
  ingredient: null,
};

export const currentIngredientSlice = createSlice({
  name: 'currentIngredient',

  initialState,

  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<Ingredient>) => {
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
