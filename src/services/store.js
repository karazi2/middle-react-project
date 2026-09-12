import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from '@services/burger-constructor/slice';
import { currentIngredientSlice } from '@services/current-ingredient/slice';
import { ingredientsApi } from '@services/ingredients/api';
import { orderApi } from '@services/order/api';

const rootReducer = combineSlices(
  ingredientsApi,
  orderApi,
  currentIngredientSlice,
  burgerConstructorSlice
);

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ingredientsApi.middleware, orderApi.middleware),

  devTools: import.meta.env.DEV,
});
