import { OrderInfo } from '@components/order-info/order-info';

import type { ReactElement } from 'react';

import type { OrderSource } from '@components/order-info/order-info';

import styles from './order-details-page.module.css';

type OrderDetailsPageProps = {
  source: OrderSource;
};

export const OrderDetailsPage = ({ source }: OrderDetailsPageProps): ReactElement => {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large mb-10">Информация о заказе</h1>

      <OrderInfo source={source} />
    </main>
  );
};
