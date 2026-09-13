import { Link } from 'react-router-dom';

import type { ReactElement } from 'react';

import styles from './not-found.module.css';

export const NotFound = (): ReactElement => {
  return (
    <main className={styles.page}>
      <p className="text text_type_digits-large">404</p>

      <h1 className="text text_type_main-large mt-6">Страница не найдена</h1>

      <Link className={`${styles.link} text text_type_main-default mt-8`} to="/">
        Вернуться на главную
      </Link>
    </main>
  );
};
