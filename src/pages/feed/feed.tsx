import type { ReactElement } from 'react';

import styles from './feed.module.css';

export const Feed = (): ReactElement => {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large">Лента заказов</h1>

      <p className="text text_type_main-medium text_color_inactive mt-8">
        Страница находится в разработке
      </p>
    </main>
  );
};
