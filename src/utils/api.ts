import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

import type { TokenData } from '@/types';

type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export const saveTokens = ({ accessToken, refreshToken }: TokenData): void => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isTokenExists = (): boolean => {
  return Boolean(localStorage.getItem('accessToken'));
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error !== 'object' || error === null || !('data' in error)) {
    return fallback;
  }

  const data = error.data;

  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return fallback;
  }

  return typeof data.message === 'string' ? data.message : fallback;
};

const isRefreshTokenResponse = (data: unknown): data is RefreshTokenResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    typeof data.success === 'boolean' &&
    'accessToken' in data &&
    typeof data.accessToken === 'string' &&
    'refreshToken' in data &&
    typeof data.refreshToken === 'string'
  );
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (!storedRefreshToken) {
    throw new Error('Refresh token is missing');
  }

  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: storedRefreshToken,
    }),
  });

  const data = (await response.json()) as unknown;

  if (!response.ok || !isRefreshTokenResponse(data) || !data.success) {
    throw new Error('Failed to refresh token');
  }

  saveTokens(data);

  return data;
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

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401 || result.error?.status === 403) {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      return result;
    }

    try {
      await refreshToken();

      result = await baseQuery(args, api, extraOptions);
    } catch {
      clearTokens();
    }
  }

  return result;
};
