import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { useAppDispatch } from '@hooks/store';
import { Feed } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { IngredientDetailsPage } from '@pages/ingredient-details-page/ingredient-details-page';
import { LoginPage } from '@pages/login/login';
import { NotFound } from '@pages/not-found/not-found';
import { OrderDetailsPage } from '@pages/order-details-page/order-details-page';
import { ProfileOrderPage } from '@pages/profile-orders/profile-orders';
import { ProfilePage } from '@pages/profile/profile';
import { ProfileForm } from '@pages/profile/profile-form';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { clearCurrentIngredient } from '@services/current-ingredient/slice';
import { checkUserAuth } from '@services/user/actions';

import type { ReactElement } from 'react';

import type { OrderSource } from '@components/order-info/order-info';

import styles from './app.module.css';

type AppLocationState = {
  backgroundLocation?: ReturnType<typeof useLocation>;
};

const IngredientModal = (): ReactElement => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleClose = (): void => {
    dispatch(clearCurrentIngredient());
    navigate(-1);
  };

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

type OrderModalProps = {
  source: OrderSource;
};

const OrderModal = ({ source }: OrderModalProps): ReactElement => {
  const navigate = useNavigate();

  const handleClose = (): void => {
    navigate(-1);
  };

  return (
    <Modal title="Информация о заказе" onClose={handleClose}>
      <OrderInfo source={source} />
    </Modal>
  );
};

export const App = (): ReactElement => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const locationState = location.state as AppLocationState | null;

  const backgroundLocation = locationState?.backgroundLocation;

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />

        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />

        <Route path="/feed" element={<Feed />} />

        <Route path="/feed/:id" element={<OrderDetailsPage source="feed" />} />

        <Route
          path="/register"
          element={<ProtectedRoute onlyUnAuth component={<RegisterPage />} />}
        />

        <Route
          path="/login"
          element={<ProtectedRoute onlyUnAuth component={<LoginPage />} />}
        />

        <Route
          path="/forgot-password"
          element={<ProtectedRoute onlyUnAuth component={<ForgotPasswordPage />} />}
        />

        <Route
          path="/reset-password"
          element={<ProtectedRoute onlyUnAuth component={<ResetPasswordPage />} />}
        />

        <Route path="/profile" element={<ProtectedRoute component={<ProfilePage />} />}>
          <Route index element={<ProfileForm />} />

          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>

        <Route
          path="/profile/orders/:id"
          element={<ProtectedRoute component={<OrderDetailsPage source="profile" />} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />

          <Route path="/feed/:id" element={<OrderModal source="feed" />} />

          <Route
            path="/profile/orders/:id"
            element={<ProtectedRoute component={<OrderModal source="profile" />} />}
          />
        </Routes>
      )}
    </div>
  );
};
