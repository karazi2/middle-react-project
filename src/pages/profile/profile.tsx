import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/store';
import { authApi, useLogoutMutation } from '@services/auth/api';

import type { ReactElement } from 'react';

import styles from './profile.module.css';

export const ProfilePage = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();

  const logoutUser = async (): Promise<void> => {
    try {
      await logout().unwrap();

      dispatch(authApi.util.resetApiState());

      navigate('/login', {
        replace: true,
      });
    } catch {
      // Ошибку запроса можно обработать отдельно.
    }
  };

  const handleLogout = (): void => {
    void logoutUser();
  };

  return (
    <main className={styles.page}>
      <aside className={styles.navigation}>
        <nav>
          <ul className={styles.menu}>
            <li>
              <NavLink
                end
                to="/profile"
                className={({ isActive }): string =>
                  `${styles.link} text text_type_main-medium ${
                    isActive ? styles.active : ''
                  }`
                }
              >
                Профиль
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/profile/orders"
                className={({ isActive }): string =>
                  `${styles.link} text text_type_main-medium ${
                    isActive ? styles.active : ''
                  }`
                }
              >
                История заказов
              </NavLink>
            </li>

            <li>
              <button
                className={`${styles.logout} text text_type_main-medium`}
                type="button"
                disabled={isLoading}
                onClick={handleLogout}
              >
                Выход
              </button>
            </li>
          </ul>
        </nav>

        <p className={`${styles.description} text text_type_main-default`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>

      <section className={styles.content}>
        <Outlet />
      </section>
    </main>
  );
};
