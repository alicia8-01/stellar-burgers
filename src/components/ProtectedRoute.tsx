import { FC } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useSelector } from '../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: JSX.Element;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const location = useLocation();

  if (onlyUnAuth) {
    if (isAuth) {
      const state = location.state as { from?: Location } | null;
      const from = state?.from;

      return <Navigate to={from?.pathname || '/'} replace />;
    }

    return children;
  }

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
