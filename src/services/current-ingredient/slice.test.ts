import { describe, expect, it } from 'vitest';

import {
  clearCurrentIngredient,
  currentIngredientSlice,
  setCurrentIngredient,
} from './slice';

import type { Ingredient } from '@/types';

const ingredient: Ingredient = {
  _id: 'ingredient-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 100,
  price: 500,
  image: 'ingredient.png',
  image_large: 'ingredient-large.png',
};

const reducer = currentIngredientSlice.reducer;

describe('currentIngredientSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      ingredient: null,
    });
  });

  it('устанавливает текущий ингредиент', () => {
    const state = reducer(undefined, setCurrentIngredient(ingredient));

    expect(state.ingredient).toEqual(ingredient);
  });

  it('очищает текущий ингредиент', () => {
    const initialState = {
      ingredient,
    };

    const state = reducer(initialState, clearCurrentIngredient());

    expect(state.ingredient).toBeNull();
  });
});
