import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink, useLocation } from 'react-router-dom';

import type { ReactElement } from 'react';

import styles from './app-header.module.css';

export const AppHeader = (): ReactElement => {
  const location = useLocation();

  const isConstructorActive =
    location.pathname === '/' || location.pathname.startsWith('/ingredients/');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to="/"
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />

            <p className="text text_type_main-default ml-2">Конструктор</p>
          </Link>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ml-10 ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />

                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />

              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
