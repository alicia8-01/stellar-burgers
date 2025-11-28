import { FC, useMemo, useEffect, useState } from 'react';
import { useLocation, useParams, Location } from 'react-router-dom';
import { OrderInfoUI, Preloader } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();

  const { items: ingredients } = useSelector((state) => state.ingredients);
  const { orders } = useSelector((state) => state.feed);
  const { userOrders, loading } = useSelector((state) => state.order);

  const [orderFromApi, setOrderFromApi] = useState<TOrder | null>(null);
  const [orderFromApiLoading, setOrderFromApiLoading] = useState(false);

  const orderNumber = number ? parseInt(number, 10) : null;

  const state = location.state as { background?: Location } | null;
  const isModal = Boolean(state?.background);

  useEffect(() => {
    if (!orderNumber) return;

    const existsInStore =
      orders.some((order) => order.number === orderNumber) ||
      userOrders.some((order) => order.number === orderNumber);

    if (existsInStore) return;

    setOrderFromApiLoading(true);
    getOrderByNumberApi(orderNumber)
      .then((res) => {
        const order = res.orders?.[0];
        if (order) {
          setOrderFromApi(order);
        }
      })
      .catch((err) => {
        console.error('Ошибка при загрузке заказа по номеру', err);
      })
      .finally(() => setOrderFromApiLoading(false));
  }, [orderNumber, orders, userOrders]);

  const orderData =
    orderFromApi ||
    (orderNumber
      ? orders.find((order) => order.number === orderNumber) ||
        userOrders.find((order) => order.number === orderNumber)
      : undefined);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          if (ingredient) {
            acc[itemId] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[itemId].count += 1;
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || orderFromApiLoading || !orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      {!isModal && number && (
        <p
          className='text text_type_digits-default pt-10'
          style={{ margin: '0 auto' }}
        >
          #{number}
        </p>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
