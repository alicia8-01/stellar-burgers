import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer
});

export type RootState = ReturnType<typeof rootReducer>;
