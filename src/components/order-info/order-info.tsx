import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { useGetIngredientsQuery } from '@services/ingredients/api';
import {
  useGetFeedQuery,
  useGetOrderByNumberQuery,
  useGetUserOrdersQuery,
} from '@services/orders/api';
import { calculateOrderPrice, formatOrderDate, getOrderStatusText } from '@utils/orders';

import type { ReactElement } from 'react';

import type { Ingredient, Order } from '@/types';

import styles from './order-info.module.css';

export type OrderSource = 'feed' | 'profile';

type OrderInfoProps = {
  source: OrderSource;
};

type OrderIngredientRow = {
  ingredient: Ingredient;
  count: number;
};

const getIngredientRows = (
  order: Order,
  ingredients: Ingredient[]
): OrderIngredientRow[] => {
  const rows = new Map<string, OrderIngredientRow>();

  order.ingredients.forEach((ingredientId) => {
    const ingredient = ingredients.find((item) => item._id === ingredientId);

    if (!ingredient) {
      return;
    }

    const existingRow = rows.get(ingredientId);

    if (existingRow) {
      existingRow.count += 1;

      return;
    }

    rows.set(ingredientId, {
      ingredient,
      count: 1,
    });
  });

  return Array.from(rows.values());
};

export const OrderInfo = ({ source }: OrderInfoProps): ReactElement => {
  const { id } = useParams<{ id: string }>();

  const { data: feedData, isLoading: isFeedLoading } = useGetFeedQuery(undefined, {
    skip: source !== 'feed',
  });

  const { data: userOrdersData, isLoading: isUserOrdersLoading } = useGetUserOrdersQuery(
    undefined,
    {
      skip: source !== 'profile',
    }
  );

  const socketData = source === 'feed' ? feedData : userOrdersData;

  const cachedOrder =
    socketData?.orders.find((order) => String(order.number) === id) ?? null;

  const isSocketLoading = source === 'feed' ? isFeedLoading : isUserOrdersLoading;

  const shouldFetchOrder =
    Boolean(id) && !isSocketLoading && Boolean(socketData) && !cachedOrder;

  const {
    data: fetchedOrder,
    isFetching: isOrderFetching,
    isError: isOrderError,
  } = useGetOrderByNumberQuery(id ?? '', {
    skip: !shouldFetchOrder,
  });

  const {
    data: ingredients = [],
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
  } = useGetIngredientsQuery();

  const order = cachedOrder ?? fetchedOrder ?? null;

  if (isSocketLoading || isOrderFetching || isIngredientsLoading) {
    return (
      <div className={styles.message}>
        <p className="text text_type_main-medium">Загрузка...</p>
      </div>
    );
  }

  if (!id || isOrderError || isIngredientsError || !order) {
    return (
      <div className={styles.message}>
        <p className="text text_type_main-medium">
          Не удалось загрузить информацию о заказе
        </p>
      </div>
    );
  }

  const ingredientRows = getIngredientRows(order, ingredients);

  const totalPrice = calculateOrderPrice(order, ingredients);

  const statusText = getOrderStatusText(order.status);

  return (
    <article className={styles.order}>
      <p className={`${styles.number} text text_type_digits-default`}>#{order.number}</p>

      <h2 className={`${styles.name} text text_type_main-medium mt-10`}>
        {order.name ?? `Заказ #${order.number}`}
      </h2>

      <p
        className={`${styles.status} ${
          order.status === 'done' ? styles.done : ''
        } text text_type_main-default mt-3`}
      >
        {statusText}
      </p>

      <h3 className="text text_type_main-medium mt-15 mb-6">Состав:</h3>

      <div className={styles.ingredients}>
        {ingredientRows.map(({ ingredient, count }) => (
          <div className={styles.ingredient} key={ingredient._id}>
            <div className={styles.ingredientInfo}>
              <div className={styles.imageContainer}>
                <img
                  className={styles.image}
                  src={ingredient.image}
                  alt={ingredient.name}
                />
              </div>

              <p className={`${styles.ingredientName} text text_type_main-default`}>
                {ingredient.name}
              </p>
            </div>

            <div className={styles.ingredientPrice}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>

              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>

      <footer className={`${styles.footer} mt-10`}>
        <p className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </p>

        <div className={styles.total}>
          <span className="text text_type_digits-default">{totalPrice}</span>

          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </article>
  );
};
