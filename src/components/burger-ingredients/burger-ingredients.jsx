import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef, useState } from 'react';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const [currentTab, setCurrentTab] = useState('bun');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const scrollRef = useRef(null);
  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');

  const selectedBun = ingredients.find((ingredient) => ingredient.type === 'bun');

  const selectedIngredients = ingredients
    .filter((ingredient) => ingredient.type !== 'bun')
    .slice(0, 5);

  const handleIngredientClick = useCallback((ingredient) => {
    setSelectedIngredient(ingredient);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedIngredient(null);
  }, []);

  const handleTabClick = (value) => {
    setCurrentTab(value);

    const refs = {
      bun: bunRef,
      sauce: sauceRef,
      main: mainRef,
    };

    const section = refs[value].current;
    const scrollContainer = scrollRef.current;

    if (section && scrollContainer) {
      scrollContainer.scrollTo({
        top: section.offsetTop - scrollContainer.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) {
      return;
    }

    const scrollTop = scrollContainer.scrollTop;

    const sauceTop = sauceRef.current.offsetTop - scrollContainer.offsetTop;

    const mainTop = mainRef.current.offsetTop - scrollContainer.offsetTop;

    if (scrollTop >= mainTop - 50) {
      setCurrentTab('main');
    } else if (scrollTop >= sauceTop - 50) {
      setCurrentTab('sauce');
    } else {
      setCurrentTab('bun');
    }
  };

  const getIngredientCount = (ingredient) => {
    if (ingredient._id === selectedBun?._id) {
      return 2;
    }

    return selectedIngredients.filter(
      (selectedIngredient) => selectedIngredient._id === ingredient._id
    ).length;
  };

  const renderIngredients = (items) => (
    <ul className={`${styles.grid} pl-4 pr-2`}>
      {items.map((ingredient) => {
        const count = getIngredientCount(ingredient);

        return (
          <li className={styles.item} key={ingredient._id}>
            <button
              className={styles.ingredient}
              type="button"
              onClick={() => handleIngredientClick(ingredient)}
            >
              {count > 0 && <Counter count={count} size="default" />}

              <img
                className={styles.image}
                src={ingredient.image}
                alt={ingredient.name}
              />

              <div className={`${styles.price} mt-1 mb-1`}>
                <span className="text text_type_digits-default mr-2">
                  {ingredient.price}
                </span>

                <CurrencyIcon type="primary" />
              </div>

              <p className={`${styles.name} text text_type_main-default`}>
                {ingredient.name}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <li>
              <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
                Булки
              </Tab>
            </li>

            <li>
              <Tab
                value="sauce"
                active={currentTab === 'sauce'}
                onClick={handleTabClick}
              >
                Соусы
              </Tab>
            </li>

            <li>
              <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
                Начинки
              </Tab>
            </li>
          </ul>
        </nav>

        <div
          ref={scrollRef}
          className={`${styles.scroll} custom-scroll`}
          onScroll={handleScroll}
        >
          <section ref={bunRef}>
            <h2 className="text text_type_main-medium mt-10 mb-6">Булки</h2>
            {renderIngredients(buns)}
          </section>

          <section ref={sauceRef}>
            <h2 className="text text_type_main-medium mt-10 mb-6">Соусы</h2>
            {renderIngredients(sauces)}
          </section>

          <section ref={mainRef}>
            <h2 className="text text_type_main-medium mt-10 mb-6">Начинки</h2>
            {renderIngredients(mains)}
          </section>
        </div>
      </section>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
