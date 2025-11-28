import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch({ type: 'order/startUserFeed' });
    return () => {
      dispatch({ type: 'order/stopUserFeed' });
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={userOrders} />;
};
