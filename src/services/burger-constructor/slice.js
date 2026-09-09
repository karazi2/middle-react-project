import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  reducerPath: 'burgerConstructor',
  initialState,

  reducers: {
    addIngredient: {
      reducer: (state, action) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },

      prepare: (ingredient) => ({
        payload: {
          ...ingredient,
          key: nanoid(),
        },
      }),
    },

    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.key !== action.payload
      );
    },

    moveIngredient: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;

      const [movedIngredient] = state.ingredients.splice(dragIndex, 1);

      state.ingredients.splice(hoverIndex, 0, movedIngredient);
    },
  },

  selectors: {
    getConstructorBun: (state) => state.bun,

    getConstructorIngredients: (state) => state.ingredients,

    getIngredientCounts: createSelector(
      [(state) => state.bun, (state) => state.ingredients],
      (bun, ingredients) => {
        const counts = {};

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
      [(state) => state.bun, (state) => state.ingredients],
      (bun, ingredients) => {
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

export const { addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;

export const {
  getConstructorBun,
  getConstructorIngredients,
  getIngredientCounts,
  getConstructorTotalPrice,
} = burgerConstructorSlice.selectors;
