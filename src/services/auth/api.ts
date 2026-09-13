import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, clearTokens, saveTokens } from '@utils/api';

import type {
  ApiMessageResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  User,
  UserResponse,
} from '@/types';

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterRequest>({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: AuthResponse) => {
        saveTokens(response);

        return response.user;
      },
    }),

    login: builder.mutation<User, LoginRequest>({
      query: (formData) => ({
        url: '/auth/login',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response: AuthResponse) => {
        saveTokens(response);

        return response.user;
      },
    }),

    logout: builder.mutation<ApiMessageResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {
          token: localStorage.getItem('refreshToken'),
        },
      }),

      transformResponse: (response: ApiMessageResponse) => {
        clearTokens();

        return response;
      },
    }),

    getUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/user',
        method: 'GET',
      }),

      transformResponse: (response: UserResponse) => response.user,
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (formData) => ({
        url: '/auth/user',
        method: 'PATCH',
        body: formData,
      }),

      transformResponse: (response: UserResponse) => response.user,
    }),

    forgotPassword: builder.mutation<ApiMessageResponse, string>({
      query: (email) => ({
        url: '/password-reset',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),

    resetPassword: builder.mutation<ApiMessageResponse, ResetPasswordRequest>({
      query: ({ password, token }) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body: {
          password,
          token,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
