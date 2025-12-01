import { rootReducer, RootState } from './rootReducer';
import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние для неизвестного экшена', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const typedState: RootState = state;

    expect(state).toEqual(initialState);
    expect(typedState).toHaveProperty('ingredients');
    expect(typedState).toHaveProperty('constructorBurger');
    expect(typedState).toHaveProperty('order');
    expect(typedState).toHaveProperty('user');
    expect(typedState).toHaveProperty('feed');
  });

  it('инициализирует срезы', () => {
    const initAction = { type: '@@INIT' };
    const rootState = rootReducer(undefined, initAction);

    expect(rootState.ingredients).toEqual(
      ingredientsReducer(undefined, initAction)
    );
    expect(rootState.constructorBurger).toEqual(
      constructorReducer(undefined, initAction)
    );
    expect(rootState.order).toEqual(orderReducer(undefined, initAction));
    expect(rootState.user).toEqual(userReducer(undefined, initAction));
    expect(rootState.feed).toEqual(feedReducer(undefined, initAction));
  });
});
