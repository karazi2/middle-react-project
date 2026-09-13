import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { userSlice } from '@services/user/slice';

export const ProtectedRoute = ({ onlyUnAuth = false, component }) => {
  const location = useLocation();

  const user = useSelector(userSlice.selectors.getUser);

  const isAuthChecked = useSelector(userSlice.selectors.getIsAuthChecked);

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';

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
