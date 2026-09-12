import { IngredientDetails } from '@components/ingredient-details/ingredient-details';

import styles from './ingredient-details-page.module.css';

export const IngredientDetailsPage = () => {
  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>

      <IngredientDetails />
    </main>
  );
};
