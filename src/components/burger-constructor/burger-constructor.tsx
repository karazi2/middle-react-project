import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import {
  addIngredient,
  clearConstructor,
  getConstructorBun,
  getConstructorIngredients,
  getConstructorTotalPrice,
  moveIngredient,
  removeIngredient,
} from '@services/burger-constructor/slice';
import { useCreateOrderMutation } from '@services/order/api';
import { userSlice } from '@services/user/slice';

import type { ReactElement } from 'react';

import type {
  ConstructorIngredient as ConstructorIngredientType,
  Ingredient,
  IngredientType,
} from '@/types';

import styles from './burger-constructor.module.css';

type ConstructorIngredientProps = {
  ingredient: ConstructorIngredientType;
  index: number;
  onRemove: (key: string) => void;
};

type ConstructorDragItem = {
  key: string;
  index: number;
  originalIndex: number;
};

type IngredientDragItem = {
  ingredient: Ingredient;
};

type ConstructorDropItem = ConstructorDragItem | IngredientDragItem;

type ConstructorDropResult = {
  insideConstructor: boolean;
};

type ConstructorCollectedProps = {
  isOver: boolean;
  draggedType: IngredientType | null;
};

type DragCollectedProps = {
  isDragging: boolean;
};

const ConstructorIngredient = ({
  ingredient,
  index,
  onRemove,
}: ConstructorIngredientProps): ReactElement => {
  const dispatch = useAppDispatch();

  const [{ isDragging }, dragRef] = useDrag<
    ConstructorDragItem,
    void,
    DragCollectedProps
  >(
    () => ({
      type: 'constructorIngredient',

      item: {
        key: ingredient.key,
        index,
        originalIndex: index,
      },

      collect: (monitor): DragCollectedProps => ({
        isDragging: monitor.isDragging(),
      }),

      end: (item, monitor): void => {
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

  const [, dropRef] = useDrop<
    ConstructorDragItem,
    ConstructorDropResult,
    Record<string, never>
  >(
    () => ({
      accept: 'constructorIngredient',

      hover: (item): void => {
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

      drop: (): ConstructorDropResult => ({
        insideConstructor: true,
      }),
    }),
    [index, dispatch]
  );

  const setRefs = (node: HTMLLIElement | null): void => {
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

export const BurgerConstructor = (): ReactElement => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector(userSlice.selectors.getUser);

  const bun = useAppSelector(getConstructorBun);

  const ingredients = useAppSelector(getConstructorIngredients);

  const totalPrice = useAppSelector(getConstructorTotalPrice);

  const [
    createOrder,
    {
      data: orderData,
      isLoading: isOrderLoading,
      isError: isOrderError,
      reset: resetOrder,
    },
  ] = useCreateOrderMutation();

  const [{ isOver, draggedType }, dropRef] = useDrop<
    ConstructorDropItem,
    ConstructorDropResult,
    ConstructorCollectedProps
  >(
    () => ({
      accept: ['ingredient', 'constructorIngredient'],

      drop: (item, monitor): ConstructorDropResult | undefined => {
        if (monitor.didDrop()) {
          return undefined;
        }

        if ('ingredient' in item) {
          dispatch(addIngredient(item.ingredient));
        }

        return {
          insideConstructor: true,
        };
      },

      collect: (monitor): ConstructorCollectedProps => {
        const item = monitor.getItem();

        return {
          isOver: monitor.isOver({
            shallow: true,
          }),

          draggedType: item && 'ingredient' in item ? item.ingredient.type : null,
        };
      },
    }),
    [dispatch]
  );

  const setDropRef = (node: HTMLElement | null): void => {
    dropRef(node);
  };

  const isBunHovered = isOver && draggedType === 'bun';

  const isIngredientHovered = isOver && draggedType !== null && draggedType !== 'bun';

  const handleRemoveIngredient = (key: string): void => {
    dispatch(removeIngredient(key));
  };

  const handleCreateOrder = (): void => {
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

    void createOrder(ingredientIds);
  };

  const handleCloseOrderModal = (): void => {
    dispatch(clearConstructor());
    resetOrder();
  };

  return (
    <section ref={setDropRef} className={styles.burger_constructor}>
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
