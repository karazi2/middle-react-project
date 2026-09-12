import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authApi } from '@services/auth/api';
import { burgerConstructorSlice } from '@services/burger-constructor/slice';
import { currentIngredientSlice } from '@services/current-ingredient/slice';
import { ingredientsApi } from '@services/ingredients/api';
import { orderApi } from '@services/order/api';
import { userSlice } from '@services/user/slice';

const rootReducer = combineSlices(
  ingredientsApi,
  orderApi,
  authApi,
  currentIngredientSlice,
  burgerConstructorSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ingredientsApi.middleware,
      orderApi.middleware,
      authApi.middleware
    ),

  devTools: import.meta.env.DEV,
});
