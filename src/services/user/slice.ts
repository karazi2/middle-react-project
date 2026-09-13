import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { authApi } from '@services/auth/api';

import type { User } from '@/types';

type UserState = {
  user: User | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
};

export const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
  },

  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addMatcher(authApi.endpoints.updateUser.matchFulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});
