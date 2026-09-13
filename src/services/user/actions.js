import { createAsyncThunk } from '@reduxjs/toolkit';

import { authApi } from '@services/auth/api';
import { userSlice } from '@services/user/slice';
import { clearTokens, isTokenExists } from '@utils/api';

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',

  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        const result = await dispatch(
          authApi.endpoints.getUser.initiate(undefined, {
            forceRefetch: true,
          })
        );

        if (result.error) {
          clearTokens();
          dispatch(userSlice.actions.setUser(null));
        }
      }
    } finally {
      dispatch(userSlice.actions.setIsAuthChecked(true));
    }
  }
);
