import { OrderCard } from '@components/order-card/order-card';
import { useGetIngredientsQuery } from '@services/ingredients/api';
import { useGetUserOrdersQuery } from '@services/orders/api';

import type { ReactElement } from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrderPage = (): ReactElement => {
  const { data: ordersData, isError: isOrdersError } = useGetUserOrdersQuery();

  const {
    data: ingredients = [],
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
  } = useGetIngredientsQuery();

  if (isIngredientsLoading) {
    return (
      <div className={styles.page}>
        <p className="text text_type_main-medium">Загрузка...</p>
      </div>
    );
  }

  if (isOrdersError || isIngredientsError || !ordersData) {
    return (
      <div className={styles.page}>
        <p className="text text_type_main-medium">
          Не удалось загрузить историю заказов
        </p>
      </div>
    );
  }

  if (ordersData.orders.length === 0) {
    return (
      <div className={styles.page}>
        <p className="text text_type_main-medium">История заказов пока пуста</p>
      </div>
    );
  }

  const sortedOrders = [...ordersData.orders].sort(
    (firstOrder, secondOrder) =>
      new Date(secondOrder.createdAt).getTime() -
      new Date(firstOrder.createdAt).getTime()
  );

  return (
    <div className={styles.page}>
      <div className={styles.list}>
        {sortedOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            ingredients={ingredients}
            path="/profile/orders"
            showStatus
          />
        ))}
      </div>
    </div>
  );
};
