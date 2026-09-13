import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

import type { Ingredient, IngredientsResponse } from '@/types';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),

  endpoints: (builder) => ({
    getIngredients: builder.query<Ingredient[], void>({
      query: () => '/ingredients',

      transformResponse: (response: IngredientsResponse) => response.data,
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
