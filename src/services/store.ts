import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authApi } from '@services/auth/api';
import { burgerConstructorSlice } from '@services/burger-constructor/slice';
import { currentIngredientSlice } from '@services/current-ingredient/slice';
import { ingredientsApi } from '@services/ingredients/api';
import { orderApi } from '@services/order/api';
import { ordersApi } from '@services/orders/api';
import { userSlice } from '@services/user/slice';

export const rootReducer = combineSlices(
  ingredientsApi,
  orderApi,
  ordersApi,
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
      ordersApi.middleware,
      authApi.middleware
    ),

  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
