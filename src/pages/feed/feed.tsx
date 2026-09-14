import { OrderCard } from '@components/order-card/order-card';
import { useGetIngredientsQuery } from '@services/ingredients/api';
import { useGetFeedQuery } from '@services/orders/api';

import type { ReactElement } from 'react';

import type { Order } from '@/types';

import styles from './feed.module.css';

const ORDERS_PER_COLUMN = 10;

const getOrderColumns = (orders: Order[]): Order[][] => {
  const firstColumn = orders.slice(0, ORDERS_PER_COLUMN);

  const secondColumn = orders.slice(ORDERS_PER_COLUMN, ORDERS_PER_COLUMN * 2);

  return secondColumn.length > 0 ? [firstColumn, secondColumn] : [firstColumn];
};

export const Feed = (): ReactElement => {
  const { data: feedData, isError: isFeedError } = useGetFeedQuery();

  const {
    data: ingredients = [],
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
  } = useGetIngredientsQuery();

  if (isIngredientsLoading) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-medium">Загрузка...</p>
      </main>
    );
  }

  if (isFeedError || isIngredientsError || !feedData) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-medium">Не удалось загрузить ленту заказов</p>
      </main>
    );
  }

  const doneOrders = feedData.orders.filter((order) => order.status === 'done');

  const inProgressOrders = feedData.orders.filter(
    (order) => order.status === 'pending' || order.status === 'created'
  );

  const doneColumns = getOrderColumns(doneOrders);

  const inProgressColumns = getOrderColumns(inProgressOrders);

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>

      <div className={styles.content}>
        <section className={styles.ordersSection}>
          <div className={styles.ordersList}>
            {feedData.orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                ingredients={ingredients}
                path="/feed"
              />
            ))}
          </div>
        </section>

        <section className={styles.statistics}>
          <div className={styles.statuses}>
            <div className={styles.statusBlock}>
              <h2 className="text text_type_main-medium mb-6">Готово:</h2>

              <div className={styles.numberColumns}>
                {doneColumns.map((column, columnIndex) => (
                  <div className={styles.numberColumn} key={`done-${columnIndex}`}>
                    {column.map((order) => (
                      <p
                        className={`${styles.doneNumber} text text_type_digits-default`}
                        key={order._id}
                      >
                        {order.number}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.statusBlock}>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>

              <div className={styles.numberColumns}>
                {inProgressColumns.map((column, columnIndex) => (
                  <div className={styles.numberColumn} key={`progress-${columnIndex}`}>
                    {column.map((order) => (
                      <p className="text text_type_digits-default" key={order._id}>
                        {order.number}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text text_type_main-medium">Выполнено за все время:</h2>

            <p className={`${styles.total} text text_type_digits-large`}>
              {feedData.total}
            </p>
          </div>

          <div>
            <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>

            <p className={`${styles.total} text text_type_digits-large`}>
              {feedData.totalToday}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
