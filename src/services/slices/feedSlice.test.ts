import feedReducer, { getFeeds } from './feedSlice';

type FeedState = ReturnType<typeof feedReducer>;

const mockFeedResponse = {
  orders: [
    {
      _id: '1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done' as const,
      name: 'Заказ 1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 1
    },
    {
      _id: '2',
      ingredients: ['ingredient3', 'ingredient4'],
      status: 'pending' as const,
      name: 'Заказ 2',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      number: 2
    }
  ],
  total: 42,
  totalToday: 7
};

describe('feedSlice reducer', () => {
  // 1. Тест начального состояния
  it('возвращает корректное начальное состояние', () => {
    const state = feedReducer(undefined, { type: '' });

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: undefined
    });
  });

  // 2. Тесты синхронных редьюсеров
  describe('синхронные редьюсеры', () => {
    it('startFeed: устанавливает loading в true и очищает ошибку', () => {
      const initialState: FeedState = {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: 'Старая ошибка'
      };

      const state = feedReducer(initialState, { type: 'feed/startFeed' });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('stopFeed: сбрасывает loading и error', () => {
      const initialState: FeedState = {
        orders: mockFeedResponse.orders,
        total: mockFeedResponse.total,
        totalToday: mockFeedResponse.totalToday,
        loading: true,
        error: 'Какая-то ошибка'
      };

      const state = feedReducer(initialState, { type: 'feed/stopFeed' });

      expect(state.loading).toBe(false);
      expect(state.error).toBeUndefined();
      expect(state.orders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
    });
  });

  // 3. Тесты async thunk
  describe('getFeeds async thunk', () => {
    it('ставит loading в true при pending', () => {
      const state: FeedState = feedReducer(undefined, {
        type: getFeeds.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('сохраняет данные и сбрасывает loading при fulfilled', () => {
      const loadingState: FeedState = feedReducer(undefined, {
        type: getFeeds.pending.type
      });

      const state: FeedState = feedReducer(loadingState, {
        type: getFeeds.fulfilled.type,
        payload: mockFeedResponse
      });

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
      expect(state.error).toBeUndefined();
    });

    it('сохраняет ошибку при rejected', () => {
      const loadingState: FeedState = feedReducer(undefined, {
        type: getFeeds.pending.type
      });

      const errorMessage = 'Failed to fetch feeds';

      const state: FeedState = feedReducer(loadingState, {
        type: getFeeds.rejected.type,
        error: { message: errorMessage }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
