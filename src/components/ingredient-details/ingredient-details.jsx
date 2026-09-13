import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getCurrentIngredient } from '@services/current-ingredient/slice';
import { useGetIngredientsQuery } from '@services/ingredients/api';

import styles from './ingredient-details.module.css';

export const IngredientDetails = ({ ingredient: ingredientProp }) => {
  const { id } = useParams();

  const currentIngredient = useSelector(getCurrentIngredient);

  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  const routeIngredient = id
    ? ingredients.find((ingredient) => ingredient._id === id)
    : null;

  const ingredient = ingredientProp || routeIngredient || currentIngredient;

  if (isLoading && !ingredient) {
    return <p className="text text_type_main-medium mt-10">Загрузка ингредиента...</p>;
  }

  if (isError) {
    return (
      <p className="text text_type_main-medium mt-10">Не удалось загрузить ингредиент</p>
    );
  }

  if (!ingredient) {
    return <p className="text text_type_main-medium mt-10">Ингредиент не найден</p>;
  }

  return (
    <div className={styles.details}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />

      <p className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</p>

      <ul className={styles.nutrients}>
        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </span>

          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </span>
        </li>

        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>

          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </span>
        </li>

        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>

          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </span>
        </li>

        <li className={styles.nutrient}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>

          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </span>
        </li>
      </ul>
    </div>
  );
};
