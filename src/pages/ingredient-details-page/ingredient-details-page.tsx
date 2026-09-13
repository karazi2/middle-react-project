import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import type { ReactElement } from 'react';

import styles from './ingredient-details-page.module.css';

export const IngredientDetailsPage = (): ReactElement => {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>

      <IngredientDetails />
    </main>
  );
};
