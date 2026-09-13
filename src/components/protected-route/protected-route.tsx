import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@hooks/store';
import { userSlice } from '@services/user/slice';

import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: ReactElement;
};

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: ProtectedRouteProps): ReactElement | null => {
  const location = useLocation();

  const user = useAppSelector(userSlice.selectors.getUser);

  const isAuthChecked = useAppSelector(userSlice.selectors.getIsAuthChecked);

  const locationState = location.state as LocationState | null;

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const from = locationState?.from?.pathname ?? '/';

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  return component;
};
