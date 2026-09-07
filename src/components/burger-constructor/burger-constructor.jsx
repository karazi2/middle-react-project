import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const bun = useMemo(
    () => ingredients.find((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );

  const burgerIngredients = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type !== 'bun').slice(0, 5),
    [ingredients]
  );

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;

    const ingredientsPrice = burgerIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [bun, burgerIngredients]);

  const handleOpenOrderModal = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
  }, []);

  if (!bun) {
    return null;
  }

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={styles.locked_element}>
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>

        <ul className={`${styles.list} custom-scroll`}>
          {burgerIngredients.map((ingredient, index) => (
            <li className={styles.item} key={`${ingredient._id}-${index}`}>
              <DragIcon type="primary" />

              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
              />
            </li>
          ))}
        </ul>

        <div className={styles.locked_element}>
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>

        <div className={`${styles.footer} mt-10`}>
          <div className={styles.total}>
            <span className="text text_type_digits-medium">{totalPrice}</span>

            <CurrencyIcon type="primary" />
          </div>

          <Button
            htmlType="button"
            type="primary"
            size="large"
            onClick={handleOpenOrderModal}
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
