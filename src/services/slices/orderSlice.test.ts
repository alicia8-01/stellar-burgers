import orderReducer, {
  createOrder,
  fetchUserOrders,
  clearOrder,
  clearUserOrders
} from './orderSlice';

type OrderState = ReturnType<typeof orderReducer>;

const mockOrder = {
  _id: '123',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done' as const,
  name: 'Тестовый заказ',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 1
};

const mockUserOrders = [
  {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done' as const,
    name: 'Заказ 10',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 10
  },
  {
    _id: '2',
    ingredients: ['ing3', 'ing4'],
    status: 'pending' as const,
    name: 'Заказ 11',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    number: 11
  }
];

describe('orderSlice reducer', () => {
  // 1. Тест начального состояния
  it('возвращает корректное начальное состояние', () => {
    const state = orderReducer(undefined, { type: '' });

    expect(state).toEqual({
      currentOrder: null,
      userOrders: [],
      loading: false,
      error: undefined
    });
  });

  // 2. Тесты синхронных редьюсеров
  describe('синхронные редьюсеры', () => {
    describe('clearOrder', () => {
      it('очищает currentOrder и error', () => {
        const stateWithOrder: OrderState = {
          currentOrder: mockOrder,
          userOrders: mockUserOrders,
          loading: false,
          error: 'Какая-то ошибка'
        };

        const state = orderReducer(stateWithOrder, clearOrder());

        expect(state.currentOrder).toBeNull();
        expect(state.error).toBeUndefined();
        expect(state.userOrders).toEqual(mockUserOrders);
        expect(state.loading).toBe(false);
      });
    });

    describe('clearUserOrders', () => {
      it('очищает userOrders', () => {
        const stateWithOrders: OrderState = {
          currentOrder: mockOrder,
          userOrders: mockUserOrders,
          loading: false,
          error: undefined
        };

        const state = orderReducer(stateWithOrders, clearUserOrders());

        expect(state.userOrders).toEqual([]);
        expect(state.currentOrder).toEqual(mockOrder);
        expect(state.error).toBeUndefined();
      });
    });
  });

  // 3. Тесты async thunk
  describe('createOrder async thunk', () => {
    it('ставит loading в true и очищает ошибку при pending', () => {
      const state: OrderState = orderReducer(undefined, {
        type: createOrder.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
      expect(state.currentOrder).toBeNull();
    });

    it('сохраняет заказ и сбрасывает loading при fulfilled', () => {
      const loadingState: OrderState = orderReducer(undefined, {
        type: createOrder.pending.type
      });

      const state: OrderState = orderReducer(loadingState, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeUndefined();
    });

    it('сохраняет ошибку и сбрасывает loading при rejected', () => {
      const loadingState: OrderState = orderReducer(undefined, {
        type: createOrder.pending.type
      });

      const errorMessage = 'Failed to create order';

      const state: OrderState = orderReducer(loadingState, {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchUserOrders async thunk', () => {
    it('ставит loading в true и очищает ошибку при pending', () => {
      const state: OrderState = orderReducer(undefined, {
        type: fetchUserOrders.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('сохраняет userOrders и сбрасывает loading при fulfilled', () => {
      const loadingState: OrderState = orderReducer(undefined, {
        type: fetchUserOrders.pending.type
      });

      const state: OrderState = orderReducer(loadingState, {
        type: fetchUserOrders.fulfilled.type,
        payload: mockUserOrders
      });

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(mockUserOrders);
      expect(state.error).toBeUndefined();
    });

    it('сохраняет ошибку и сбрасывает loading при rejected', () => {
      const loadingState: OrderState = orderReducer(undefined, {
        type: fetchUserOrders.pending.type
      });

      const errorMessage = 'Failed to fetch user orders';

      const state: OrderState = orderReducer(loadingState, {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  // 4. Интеграционный тест
  describe('интеграционный сценарий', () => {
    it('создание заказа → очистка заказа → получение истории', () => {
      let state = orderReducer(undefined, { type: '' });

      state = orderReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);

      state = orderReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.currentOrder).toEqual(mockOrder);

      state = orderReducer(state, clearOrder());
      expect(state.currentOrder).toBeNull();

      state = orderReducer(state, { type: fetchUserOrders.pending.type });
      expect(state.loading).toBe(true);

      state = orderReducer(state, {
        type: fetchUserOrders.fulfilled.type,
        payload: mockUserOrders
      });
      expect(state.userOrders).toEqual(mockUserOrders);
    });
  });
});
