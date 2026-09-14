import { describe, expect, it } from 'vitest';

import {
  addIngredient,
  burgerConstructorSlice,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} from './slice';

import type { ConstructorIngredient, Ingredient } from '@/types';

const bun: Ingredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 100,
  price: 1000,
  image: 'bun.png',
  image_large: 'bun-large.png',
};

const ingredient: Ingredient = {
  _id: 'ingredient-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 15,
  fat: 25,
  carbohydrates: 35,
  calories: 150,
  price: 500,
  image: 'ingredient.png',
  image_large: 'ingredient-large.png',
};

const firstIngredient: ConstructorIngredient = {
  ...ingredient,
  _id: 'ingredient-1',
  name: 'Первый ингредиент',
  key: 'key-1',
};

const secondIngredient: ConstructorIngredient = {
  ...ingredient,
  _id: 'ingredient-2',
  name: 'Второй ингредиент',
  key: 'key-2',
};

const reducer = burgerConstructorSlice.reducer;

describe('burgerConstructorSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('добавляет булку в конструктор', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual({
      ...bun,
      key: expect.any(String),
    });

    expect(state.ingredients).toEqual([]);
  });

  it('добавляет ингредиент в конструктор', () => {
    const state = reducer(undefined, addIngredient(ingredient));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);

    expect(state.ingredients[0]).toEqual({
      ...ingredient,
      key: expect.any(String),
    });
  });

  it('удаляет ингредиент из конструктора', () => {
    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = reducer(initialState, removeIngredient('key-1'));

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  it('перемещает ингредиент в конструкторе', () => {
    const initialState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = reducer(
      initialState,
      moveIngredient({
        dragIndex: 0,
        hoverIndex: 1,
      })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('очищает конструктор', () => {
    const initialState = {
      bun: {
        ...bun,
        key: 'bun-key',
      },
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = reducer(initialState, clearConstructor());

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
