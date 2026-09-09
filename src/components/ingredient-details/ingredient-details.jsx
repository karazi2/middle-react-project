import styles from './ingredient-details.module.css';

export const IngredientDetails = ({ ingredient }) => {
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
