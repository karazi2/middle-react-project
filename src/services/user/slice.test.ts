import { describe, expect, it } from 'vitest';

import { authApi } from '@services/auth/api';

import { userSlice } from './slice';

import type { User } from '@/types';

type FulfilledAction = {
  type: string;
  payload: unknown;
  meta: {
    arg: {
      endpointName: string;
    };
    requestId: string;
    requestStatus: 'fulfilled';
  };
};

const user: User = {
  email: 'test@example.com',
  name: 'Тестовый пользователь',
};

const updatedUser: User = {
  email: 'updated@example.com',
  name: 'Обновлённый пользователь',
};

const reducer = userSlice.reducer;

const { setUser, setIsAuthChecked } = userSlice.actions;

const createMutationFulfilledAction = (
  endpointName: string,
  payload?: unknown
): FulfilledAction => ({
  type: `${authApi.reducerPath}/executeMutation/fulfilled`,
  payload,
  meta: {
    arg: {
      endpointName,
    },
    requestId: 'test-request',
    requestStatus: 'fulfilled',
  },
});

const createQueryFulfilledAction = (
  endpointName: string,
  payload?: unknown
): FulfilledAction => ({
  type: `${authApi.reducerPath}/executeQuery/fulfilled`,
  payload,
  meta: {
    arg: {
      endpointName,
    },
    requestId: 'test-request',
    requestStatus: 'fulfilled',
  },
});

describe('userSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
    });
  });

  it('устанавливает пользователя', () => {
    const state = reducer(undefined, setUser(user));

    expect(state.user).toEqual(user);
  });

  it('очищает пользователя', () => {
    const initialState = {
      user,
      isAuthChecked: true,
    };

    const state = reducer(initialState, setUser(null));

    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
    });
  });

  it('устанавливает статус проверки авторизации', () => {
    const state = reducer(undefined, setIsAuthChecked(true));

    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
    });
  });

  it('обрабатывает успешную регистрацию', () => {
    const state = reducer(undefined, createMutationFulfilledAction('register', user));

    expect(state).toEqual({
      user,
      isAuthChecked: true,
    });
  });

  it('обрабатывает успешный вход', () => {
    const state = reducer(undefined, createMutationFulfilledAction('login', user));

    expect(state).toEqual({
      user,
      isAuthChecked: true,
    });
  });

  it('обрабатывает успешное получение пользователя', () => {
    const initialState = {
      user: null,
      isAuthChecked: true,
    };

    const state = reducer(initialState, createQueryFulfilledAction('getUser', user));

    expect(state).toEqual({
      user,
      isAuthChecked: true,
    });
  });

  it('обрабатывает успешное обновление пользователя', () => {
    const initialState = {
      user,
      isAuthChecked: true,
    };

    const state = reducer(
      initialState,
      createMutationFulfilledAction('updateUser', updatedUser)
    );

    expect(state).toEqual({
      user: updatedUser,
      isAuthChecked: true,
    });
  });

  it('обрабатывает успешный выход', () => {
    const initialState = {
      user,
      isAuthChecked: true,
    };

    const state = reducer(initialState, createMutationFulfilledAction('logout'));

    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
    });
  });
});
