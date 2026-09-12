import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { useGetIngredientsQuery } from '@services/ingredients/api';

import styles from './home.module.css';

export const Home = () => {
  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>

      {isLoading && (
        <p className={`${styles.message} text text_type_main-medium`}>
          Загрузка ингредиентов...
        </p>
      )}

      {isError && (
        <p className={`${styles.message} text text_type_main-medium`}>
          Не удалось загрузить ингредиенты
        </p>
      )}

      {!isLoading && !isError && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor />
        </main>
      )}
    </DndProvider>
  );
};
