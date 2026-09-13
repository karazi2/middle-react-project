import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { ConstructorIngredient, Ingredient, MoveIngredientPayload } from '@/types';

type BurgerConstructorState = {
  bun: ConstructorIngredient | null;
  ingredients: ConstructorIngredient[];
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  reducerPath: 'burgerConstructor',
  initialState,

  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<ConstructorIngredient>): void => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },

      prepare: (ingredient: Ingredient): { payload: ConstructorIngredient } => ({
        payload: {
          ...ingredient,
          key: nanoid(),
        },
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.key !== action.payload
      );
    },

    moveIngredient: (state, action: PayloadAction<MoveIngredientPayload>): void => {
      const { dragIndex, hoverIndex } = action.payload;

      const [movedIngredient] = state.ingredients.splice(dragIndex, 1);

      state.ingredients.splice(hoverIndex, 0, movedIngredient);
    },

    clearConstructor: (state): void => {
      state.bun = null;
      state.ingredients = [];
    },
  },

  selectors: {
    getConstructorBun: (state: BurgerConstructorState): ConstructorIngredient | null =>
      state.bun,

    getConstructorIngredients: (
      state: BurgerConstructorState
    ): ConstructorIngredient[] => state.ingredients,

    getIngredientCounts: createSelector(
      [
        (state: BurgerConstructorState): ConstructorIngredient | null => state.bun,

        (state: BurgerConstructorState): ConstructorIngredient[] => state.ingredients,
      ],
      (
        bun: ConstructorIngredient | null,
        ingredients: ConstructorIngredient[]
      ): Record<string, number> => {
        const counts: Record<string, number> = {};

        if (bun) {
          counts[bun._id] = 2;
        }

        ingredients.forEach((ingredient) => {
          counts[ingredient._id] = (counts[ingredient._id] || 0) + 1;
        });

        return counts;
      }
    ),

    getConstructorTotalPrice: createSelector(
      [
        (state: BurgerConstructorState): ConstructorIngredient | null => state.bun,

        (state: BurgerConstructorState): ConstructorIngredient[] => state.ingredients,
      ],
      (
        bun: ConstructorIngredient | null,
        ingredients: ConstructorIngredient[]
      ): number => {
        const bunPrice = bun ? bun.price * 2 : 0;

        const ingredientsPrice = ingredients.reduce(
          (total, ingredient) => total + ingredient.price,
          0
        );

        return bunPrice + ingredientsPrice;
      }
    ),
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  burgerConstructorSlice.actions;

export const {
  getConstructorBun,
  getConstructorIngredients,
  getIngredientCounts,
  getConstructorTotalPrice,
} = burgerConstructorSlice.selectors;
