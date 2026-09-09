import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { useGetIngredientsQuery } from '@services/ingredients/api';

import styles from './app.module.css';

export const App = () => {
  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  return (
    <div className={styles.app}>
      <AppHeader />

      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      {isLoading && (
        <p className="text text_type_main-medium">Загрузка ингредиентов...</p>
      )}

      {isError && (
        <p className="text text_type_main-medium">Не удалось загрузить ингредиенты</p>
      )}

      {!isLoading && !isError && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor />
        </main>
      )}
    </div>
  );
};
