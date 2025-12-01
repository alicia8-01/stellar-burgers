import { configureStore, Middleware } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { getCookie } from '../utils/cookie';

const WS_BASE_URL = process.env.BURGER_API_URL
  ? process.env.BURGER_API_URL.replace('http', 'ws').replace('/api', '/orders')
  : 'wss://norma.nomoreparties.space/orders';

let socket: WebSocket | null = null;

const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const actionType = (action as { type: string }).type;

  if (actionType === 'feed/startFeed') {
    if (socket) socket.close();
    socket = new WebSocket(`${WS_BASE_URL}/all`);
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      store.dispatch({ type: 'feed/setFeedData', payload: data });
    };
  } else if (actionType === 'order/startUserFeed') {
    if (socket) socket.close();
    const token = getCookie('accessToken');
    const accessToken = token ? token.replace('Bearer ', '') : '';
    socket = new WebSocket(`${WS_BASE_URL}?token=${accessToken}`);
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      store.dispatch({ type: 'order/setUserOrders', payload: data });
    };
  } else if (
    actionType === 'feed/stopFeed' ||
    actionType === 'order/stopUserFeed'
  ) {
    if (socket) {
      socket.close();
      socket = null;
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
