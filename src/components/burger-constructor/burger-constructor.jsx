import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  addIngredient,
  getConstructorBun,
  getConstructorIngredients,
  getConstructorTotalPrice,
  moveIngredient,
  removeIngredient,
} from '@services/burger-constructor/slice';
import { useCreateOrderMutation } from '@services/order/api';
import { userSlice } from '@services/user/slice';

import styles from './burger-constructor.module.css';

const ConstructorIngredient = ({ ingredient, index, onRemove }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'constructorIngredient',

      item: {
        key: ingredient.key,
        index,
        originalIndex: index,
      },

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),

      end: (item, monitor) => {
        if (!monitor.didDrop() && item.index !== item.originalIndex) {
          dispatch(
            moveIngredient({
              dragIndex: item.index,
              hoverIndex: item.originalIndex,
            })
          );
        }
      },
    }),
    [ingredient.key, index, dispatch]
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: 'constructorIngredient',

      hover: (item) => {
        if (item.index === index) {
          return;
        }

        dispatch(
          moveIngredient({
            dragIndex: item.index,
            hoverIndex: index,
          })
        );

        item.index = index;
      },

      drop: () => ({
        insideConstructor: true,
      }),
    }),
    [index, dispatch]
  );

  const setRefs = (node) => {
    dragRef(node);
    dropRef(node);
  };

  return (
    <li
      ref={setRefs}
      className={`${styles.ingredient} ${isDragging ? styles.dragging : ''}`}
    >
      <div className={styles.drag_icon}>
        <DragIcon type="primary" />
      </div>

      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient.key)}
      />
    </li>
  );
};

export const BurgerConstructor = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(userSlice.selectors.getUser);

  const bun = useSelector(getConstructorBun);

  const ingredients = useSelector(getConstructorIngredients);

  const totalPrice = useSelector(getConstructorTotalPrice);

  const [
    createOrder,
    {
      data: orderData,
      isLoading: isOrderLoading,
      isError: isOrderError,
      reset: resetOrder,
    },
  ] = useCreateOrderMutation();

  const [{ isOver, draggedType }, dropRef] = useDrop(
    () => ({
      accept: ['ingredient', 'constructorIngredient'],

      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return undefined;
        }

        if (item.ingredient) {
          dispatch(addIngredient(item.ingredient));
        }

        return {
          insideConstructor: true,
        };
      },

      collect: (monitor) => ({
        isOver: monitor.isOver({
          shallow: true,
        }),

        draggedType: monitor.getItem()?.ingredient?.type ?? null,
      }),
    }),
    [dispatch]
  );

  const isBunHovered = isOver && draggedType === 'bun';

  const isIngredientHovered = isOver && draggedType !== null && draggedType !== 'bun';

  const handleRemoveIngredient = (key) => {
    dispatch(removeIngredient(key));
  };

  const handleCreateOrder = () => {
    if (!bun) {
      return;
    }

    if (!user) {
      navigate('/login', {
        state: {
          from: location,
        },
      });

      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id,
    ];

    createOrder(ingredientIds);
  };

  const handleCloseOrderModal = () => {
    resetOrder();
  };

  return (
    <section ref={dropRef} className={styles.burger_constructor}>
      {bun ? (
        <div className={styles.bun}>
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.bun_top} ${
            isBunHovered ? styles.placeholder_hovered : ''
          }`}
        >
          <span className="text text_type_main-default">Перенесите булку</span>
        </div>
      )}

      {ingredients.length > 0 ? (
        <ul className={styles.ingredients}>
          {ingredients.map((ingredient, index) => (
            <ConstructorIngredient
              key={ingredient.key}
              ingredient={ingredient}
              index={index}
              onRemove={handleRemoveIngredient}
            />
          ))}
        </ul>
      ) : (
        <div
          className={`${styles.placeholder} ${
            isIngredientHovered ? styles.placeholder_hovered : ''
          }`}
        >
          <span className="text text_type_main-default">Перенесите ингредиенты</span>
        </div>
      )}

      {bun ? (
        <div className={styles.bun}>
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.bun_bottom} ${
            isBunHovered ? styles.placeholder_hovered : ''
          }`}
        >
          <span className="text text_type_main-default">Перенесите булку</span>
        </div>
      )}

      <div className={styles.order}>
        <div className={styles.total}>
          <span className="text text_type_digits-medium">{totalPrice}</span>

          <CurrencyIcon type="primary" />
        </div>

        <Button
          htmlType="button"
          type="primary"
          size="medium"
          disabled={!bun || isOrderLoading}
          onClick={handleCreateOrder}
        >
          {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>

      {isOrderError && (
        <p className={`${styles.error} text text_type_main-default`}>
          Не удалось оформить заказ
        </p>
      )}

      {orderData?.success && (
        <Modal title="" onClose={handleCloseOrderModal}>
          <OrderDetails orderNumber={orderData.order.number} />
        </Modal>
      )}
    </section>
  );
};
