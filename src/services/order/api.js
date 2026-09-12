import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

export const orderApi = createApi({
  reducerPath: 'orderApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),

  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (ingredients) => ({
        url: '/orders',
        method: 'POST',
        body: {
          ingredients,
        },
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
