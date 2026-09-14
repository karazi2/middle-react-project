import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import {
  calculateOrderPrice,
  formatOrderDate,
  getOrderIngredients,
  getOrderStatusText,
} from '@utils/orders';

import type { ReactElement } from 'react';

import type { Ingredient, Order } from '@/types';

import styles from './order-card.module.css';

type OrderCardProps = {
  order: Order;
  ingredients: Ingredient[];
  path: '/feed' | '/profile/orders';
  showStatus?: boolean;
};

const MAX_VISIBLE_INGREDIENTS = 6;

export const OrderCard = ({
  order,
  ingredients,
  path,
  showStatus = false,
}: OrderCardProps): ReactElement => {
  const location = useLocation();

  const orderIngredients = getOrderIngredients(order, ingredients);

  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);

  const hiddenIngredientsCount = orderIngredients.length - MAX_VISIBLE_INGREDIENTS;

  const price = calculateOrderPrice(order, ingredients);

  return (
    <Link
      className={styles.link}
      to={`${path}/${order.number}`}
      state={{
        backgroundLocation: location,
      }}
    >
      <article className={styles.card}>
        <div className={styles.header}>
          <p className="text text_type_digits-default">#{order.number}</p>

          <p className="text text_type_main-default text_color_inactive">
            {formatOrderDate(order.createdAt)}
          </p>
        </div>

        <h2 className={`${styles.name} text text_type_main-medium mt-6`}>
          {order.name ?? `Заказ #${order.number}`}
        </h2>

        {showStatus && (
          <p className={`${styles.status} text text_type_main-default mt-2`}>
            {getOrderStatusText(order.status)}
          </p>
        )}

        <div className={`${styles.footer} mt-6`}>
          <div className={styles.ingredients}>
            {visibleIngredients.map((ingredient, index) => {
              const isLastVisible = index === MAX_VISIBLE_INGREDIENTS - 1;

              return (
                <div
                  className={styles.ingredient}
                  key={`${ingredient._id}-${index}`}
                  style={{
                    zIndex: MAX_VISIBLE_INGREDIENTS - index,
                  }}
                >
                  <img
                    className={styles.image}
                    src={ingredient.image}
                    alt={ingredient.name}
                  />

                  {isLastVisible && hiddenIngredientsCount > 0 && (
                    <div className={styles.ingredientOverlay}>
                      <span className="text text_type_main-default">
                        +{hiddenIngredientsCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.price}>
            <span className="text text_type_digits-default">{price}</span>

            <CurrencyIcon type="primary" />
          </div>
        </div>
      </article>
    </Link>
  );
};
