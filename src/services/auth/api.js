import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, clearTokens, saveTokens } from '@utils/api';

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: '/auth/register',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response) => {
        saveTokens(response);

        return response.user;
      },
    }),

    login: builder.mutation({
      query: (formData) => ({
        url: '/auth/login',
        method: 'POST',
        body: formData,
      }),

      transformResponse: (response) => {
        saveTokens(response);

        return response.user;
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {
          token: localStorage.getItem('refreshToken'),
        },
      }),

      transformResponse: (response) => {
        clearTokens();

        return response;
      },
    }),

    getUser: builder.query({
      query: () => ({
        url: '/auth/user',
        method: 'GET',
      }),

      transformResponse: (response) => response.user,
    }),

    updateUser: builder.mutation({
      query: (formData) => ({
        url: '/auth/user',
        method: 'PATCH',
        body: formData,
      }),

      transformResponse: (response) => response.user,
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/password-reset',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),

    resetPassword: builder.mutation({
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
