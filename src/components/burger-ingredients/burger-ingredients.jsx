import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { getIngredientCounts } from '@services/burger-constructor/slice';
import { setCurrentIngredient } from '@services/current-ingredient/slice';

import styles from './burger-ingredients.module.css';

const IngredientCard = ({ ingredient, count, onClick }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'ingredient',

      item: {
        ingredient,
      },

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  return (
    <li
      ref={dragRef}
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

export const BurgerIngredients = ({ ingredients }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const ingredientCounts = useSelector(getIngredientCounts);

  const [currentTab, setCurrentTab] = useState('bun');

  const scrollRef = useRef(null);
  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');

  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');

  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');

  const handleIngredientClick = (ingredient) => {
    dispatch(setCurrentIngredient(ingredient));

    navigate(`/ingredients/${ingredient._id}`, {
      state: {
        backgroundLocation: location,
      },
    });
  };

  const handleTabClick = (value) => {
    const refs = {
      bun: bunRef,
      sauce: sauceRef,
      main: mainRef,
    };

    const target = refs[value].current;
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

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();

    const sections = [
      {
        type: 'bun',
        ref: bunRef,
      },
      {
        type: 'sauce',
        ref: sauceRef,
      },
      {
        type: 'main',
        ref: mainRef,
      },
    ];

    const closestSection = sections.reduce((closest, section) => {
      if (!section.ref.current) {
        return closest;
      }

      const sectionRect = section.ref.current.getBoundingClientRect();

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

  const renderIngredients = (items) => (
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
