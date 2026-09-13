import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

export const saveTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isTokenExists = () => {
  return Boolean(localStorage.getItem('accessToken'));
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      headers.set('authorization', accessToken);
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401 || result.error?.status === 403) {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/token',
        method: 'POST',
        body: {
          token: refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data?.success) {
      saveTokens(refreshResult.data);

      result = await baseQuery(args, api, extraOptions);
    } else {
      clearTokens();
    }
  }

  return result;
};
