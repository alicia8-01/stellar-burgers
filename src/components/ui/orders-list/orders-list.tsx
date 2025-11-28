import { FC } from 'react';
import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

import styles from './orders-list.module.css';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => (
  <div className={`${styles.content}`}>
    {orderByDate.map((order) => (
      <OrderCard order={order} key={order._id} />
    ))}
  </div>
);
