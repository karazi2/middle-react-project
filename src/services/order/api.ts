import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from '@utils/api';

import type { CreateOrderResponse } from '@/types';

export const orderApi = createApi({
  reducerPath: 'orderApi',

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, string[]>({
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
