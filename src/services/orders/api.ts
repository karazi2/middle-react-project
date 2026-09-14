import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth, refreshToken } from '@utils/api';
import { WS_ORDERS_URL } from '@utils/constants';

import type { Order, OrderResponse, OrdersResponse, OrderStatus } from '@/types';

const RECONNECT_PERIOD = 3000;

const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';

const getEmptyOrdersResponse = (): OrdersResponse => ({
  success: true,
  orders: [],
  total: 0,
  totalToday: 0,
});

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isOrderStatus = (value: unknown): value is OrderStatus => {
  return value === 'created' || value === 'pending' || value === 'done';
};

const isOrder = (value: unknown): value is Order => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.ingredients) &&
    value.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    typeof value._id === 'string' &&
    isOrderStatus(value.status) &&
    typeof value.number === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    (value.name === undefined || typeof value.name === 'string')
  );
};

const isOrdersResponse = (value: unknown): value is OrdersResponse => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.success === 'boolean' &&
    Array.isArray(value.orders) &&
    value.orders.every(isOrder) &&
    typeof value.total === 'number' &&
    typeof value.totalToday === 'number'
  );
};

const getSocketMessage = (value: unknown): string | null => {
  if (!isRecord(value) || !('message' in value) || typeof value.message !== 'string') {
    return null;
  }

  return value.message;
};

const parseSocketData = (data: string): unknown => {
  try {
    return JSON.parse(data) as unknown;
  } catch {
    return null;
  }
};

const getAccessToken = (): string | null => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return null;
  }

  return accessToken.replace(/^Bearer\s+/i, '');
};

export const ordersApi = createApi({
  reducerPath: 'ordersApi',

  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    getFeed: builder.query<OrdersResponse, void>({
      queryFn: () => ({
        data: getEmptyOrdersResponse(),
      }),

      keepUnusedDataFor: 0,

      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ): Promise<void> {
        let reconnectTimerId: number | null = null;

        const socketRef: {
          current: WebSocket | null;
        } = {
          current: null,
        };

        let isUnsubscribed = false;

        const connect = (): void => {
          if (isUnsubscribed) {
            return;
          }

          if (reconnectTimerId !== null) {
            window.clearTimeout(reconnectTimerId);
            reconnectTimerId = null;
          }

          const currentSocket = new WebSocket(`${WS_ORDERS_URL}/all`);

          socketRef.current = currentSocket;

          currentSocket.onmessage = (event: MessageEvent<string>): void => {
            const data = parseSocketData(event.data);

            if (!isOrdersResponse(data)) {
              return;
            }

            updateCachedData((draft): void => {
              draft.success = data.success;
              draft.orders = data.orders;
              draft.total = data.total;
              draft.totalToday = data.totalToday;
            });
          };

          currentSocket.onclose = (): void => {
            if (socketRef.current !== currentSocket) {
              return;
            }

            socketRef.current = null;

            if (!isUnsubscribed) {
              reconnectTimerId = window.setTimeout(connect, RECONNECT_PERIOD);
            }
          };
        };

        try {
          await cacheDataLoaded;

          connect();

          await cacheEntryRemoved;
        } finally {
          isUnsubscribed = true;

          if (reconnectTimerId !== null) {
            window.clearTimeout(reconnectTimerId);
            reconnectTimerId = null;
          }

          socketRef.current?.close();
          socketRef.current = null;
        }
      },
    }),

    getUserOrders: builder.query<OrdersResponse, void>({
      queryFn: () => ({
        data: getEmptyOrdersResponse(),
      }),

      keepUnusedDataFor: 0,

      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ): Promise<void> {
        let reconnectTimerId: number | null = null;

        const socketRef: {
          current: WebSocket | null;
        } = {
          current: null,
        };

        let isUnsubscribed = false;
        let isRefreshingToken = false;

        const connect = (): void => {
          if (isUnsubscribed) {
            return;
          }

          if (reconnectTimerId !== null) {
            window.clearTimeout(reconnectTimerId);
            reconnectTimerId = null;
          }

          const accessToken = getAccessToken();

          if (!accessToken) {
            reconnectTimerId = window.setTimeout(connect, RECONNECT_PERIOD);

            return;
          }

          const currentSocket = new WebSocket(
            `${WS_ORDERS_URL}?token=${encodeURIComponent(accessToken)}`
          );

          socketRef.current = currentSocket;

          currentSocket.onmessage = (event: MessageEvent<string>): void => {
            const data = parseSocketData(event.data);

            if (getSocketMessage(data) === INVALID_TOKEN_MESSAGE) {
              if (isRefreshingToken) {
                return;
              }

              isRefreshingToken = true;

              void refreshToken()
                .then((): void => {
                  isRefreshingToken = false;

                  if (isUnsubscribed || socketRef.current !== currentSocket) {
                    return;
                  }

                  currentSocket.close();

                  if (socketRef.current === currentSocket) {
                    socketRef.current = null;
                  }

                  connect();
                })
                .catch((): void => {
                  isRefreshingToken = false;
                });

              return;
            }

            if (!isOrdersResponse(data)) {
              return;
            }

            updateCachedData((draft): void => {
              draft.success = data.success;
              draft.orders = data.orders;
              draft.total = data.total;
              draft.totalToday = data.totalToday;
            });
          };

          currentSocket.onclose = (): void => {
            if (socketRef.current !== currentSocket) {
              return;
            }

            socketRef.current = null;

            if (!isUnsubscribed) {
              reconnectTimerId = window.setTimeout(connect, RECONNECT_PERIOD);
            }
          };
        };

        try {
          await cacheDataLoaded;

          connect();

          await cacheEntryRemoved;
        } finally {
          isUnsubscribed = true;

          if (reconnectTimerId !== null) {
            window.clearTimeout(reconnectTimerId);
            reconnectTimerId = null;
          }

          socketRef.current?.close();
          socketRef.current = null;
        }
      },
    }),

    getOrderByNumber: builder.query<Order | null, string>({
      query: (orderNumber): string => `/orders/${orderNumber}`,

      transformResponse: (response: OrderResponse): Order | null => {
        return response.orders[0] ?? null;
      },
    }),
  }),
});

export const { useGetFeedQuery, useGetUserOrdersQuery, useGetOrderByNumberQuery } =
  ordersApi;
