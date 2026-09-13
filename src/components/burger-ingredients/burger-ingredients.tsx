import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@hooks/store';
import { getIngredientCounts } from '@services/burger-constructor/slice';
import { setCurrentIngredient } from '@services/current-ingredient/slice';
import { useGetIngredientsQuery } from '@services/ingredients/api';

import type { ReactElement } from 'react';

import type { Ingredient, IngredientType } from '@/types';

import styles from './burger-ingredients.module.css';

type IngredientDragItem = {
  ingredient: Ingredient;
};

type IngredientCardProps = {
  ingredient: Ingredient;
  count: number;
  onClick: (ingredient: Ingredient) => void;
};

type ClosestSection = {
  type: IngredientType;
  distance: number;
};

type IngredientCollectedProps = {
  isDragging: boolean;
};

const IngredientCard = ({
  ingredient,
  count,
  onClick,
}: IngredientCardProps): ReactElement => {
  const [{ isDragging }, dragRef] = useDrag<
    IngredientDragItem,
    void,
    IngredientCollectedProps
  >(
    () => ({
      type: 'ingredient',

      item: {
        ingredient,
      },

      collect: (monitor): IngredientCollectedProps => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  const setDragRef = (node: HTMLLIElement | null): void => {
    dragRef(node);
  };

  return (
    <li
      ref={setDragRef}
      className={`${styles.ingredient} ${isDragging ? styles.dragging : ''}`}
      onClick={() => onClick(ingredient)}
    >
      {count > 0 && <Counter count={count} size="default" extraClass={styles.counter} />}

      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />

      <div className={styles.price}>
        <span className="text text_type_digits-default">{ingredient.price}</span>

        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};

export const BurgerIngredients = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: ingredients = [], isLoading, isError } = useGetIngredientsQuery();

  const ingredientCounts = useAppSelector(getIngredientCounts);

  const [currentTab, setCurrentTab] = useState<IngredientType>('bun');

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const bunRef = useRef<HTMLHeadingElement | null>(null);

  const sauceRef = useRef<HTMLHeadingElement | null>(null);

  const mainRef = useRef<HTMLHeadingElement | null>(null);

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');

  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');

  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');

  const handleIngredientClick = (ingredient: Ingredient): void => {
    dispatch(setCurrentIngredient(ingredient));

    navigate(`/ingredients/${ingredient._id}`, {
      state: {
        backgroundLocation: location,
      },
    });
  };

  const handleTabClick = (value: string): void => {
    let target: HTMLHeadingElement | null = null;

    if (value === 'bun') {
      target = bunRef.current;
    } else if (value === 'sauce') {
      target = sauceRef.current;
    } else if (value === 'main') {
      target = mainRef.current;
    } else {
      return;
    }

    const container = scrollRef.current;

    if (!target || !container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const targetRect = target.getBoundingClientRect();

    container.scrollTo({
      top: container.scrollTop + targetRect.top - containerRect.top,
      behavior: 'smooth',
    });

    setCurrentTab(value);
  };

  const handleScroll = (): void => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const sections: {
      type: IngredientType;
      element: HTMLHeadingElement | null;
    }[] = [
      {
        type: 'bun',
        element: bunRef.current,
      },
      {
        type: 'sauce',
        element: sauceRef.current,
      },
      {
        type: 'main',
        element: mainRef.current,
      },
    ];

    const closestSection = sections.reduce<ClosestSection | null>((closest, section) => {
      if (!section.element) {
        return closest;
      }

      const sectionRect = section.element.getBoundingClientRect();

      const distance = Math.abs(sectionRect.top - containerRect.top);

      if (!closest || distance < closest.distance) {
        return {
          type: section.type,
          distance,
        };
      }

      return closest;
    }, null);

    if (closestSection) {
      setCurrentTab(closestSection.type);
    }
  };

  const renderIngredients = (items: Ingredient[]): ReactElement => (
    <ul className={styles.ingredients_list}>
      {items.map((ingredient) => (
        <IngredientCard
          key={ingredient._id}
          ingredient={ingredient}
          count={ingredientCounts[ingredient._id] || 0}
          onClick={handleIngredientClick}
        />
      ))}
    </ul>
  );

  if (isLoading) {
    return (
      <section className={styles.burger_ingredients}>
        <p className="text text_type_main-medium">Загрузка ингредиентов...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.burger_ingredients}>
        <p className="text text_type_main-medium">Не удалось загрузить ингредиенты</p>
      </section>
    );
  }

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <div className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>

          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>

          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </div>
      </nav>

      <div ref={scrollRef} className={styles.scroll} onScroll={handleScroll}>
        <h2 ref={bunRef} className="text text_type_main-medium mt-10 mb-6">
          Булки
        </h2>

        {renderIngredients(buns)}

        <h2 ref={sauceRef} className="text text_type_main-medium mt-10 mb-6">
          Соусы
        </h2>

        {renderIngredients(sauces)}

        <h2 ref={mainRef} className="text text_type_main-medium mt-10 mb-6">
          Начинки
        </h2>

        {renderIngredients(mains)}
      </div>
    </section>
  );
};
