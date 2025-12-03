import ingredientsReducer, {
  fetchIngredients,
  setCurrentIngredient,
  clearCurrentIngredient
} from './ingredientsSlice';

const mockIngredients = [
  {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun' as const,
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
    __v: 0
  },
  {
    _id: '2',
    name: 'Тестовая начинка',
    type: 'main' as const,
    proteins: 5,
    fat: 10,
    carbohydrates: 15,
    calories: 20,
    price: 50,
    image: 'image2.png',
    image_mobile: 'image2-mobile.png',
    image_large: 'image2-large.png',
    __v: 0
  },
  {
    _id: '3',
    name: 'Тестовый соус',
    type: 'sauce' as const,
    proteins: 2,
    fat: 5,
    carbohydrates: 8,
    calories: 15,
    price: 30,
    image: 'image3.png',
    image_mobile: 'image3-mobile.png',
    image_large: 'image3-large.png',
    __v: 0
  }
];

describe('ingredientsSlice reducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: undefined,
    currentIngredient: null
  };

  // 1. Тесты начального состояния
  describe('начальное состояние', () => {
    it('должно возвращать корректное начальное состояние', () => {
      const result = ingredientsReducer(undefined, { type: '' });

      expect(result).toEqual({
        items: [],
        loading: false,
        error: undefined,
        currentIngredient: null
      });
    });
  });

  // 2. Тесты синхронных редьюсеров
  describe('синхронные редьюсеры', () => {
    describe('setCurrentIngredient', () => {
      it('устанавливает текущий ингредиент', () => {
        const action = setCurrentIngredient(mockIngredients[0]);
        const state = ingredientsReducer(initialState, action);

        expect(state.currentIngredient).toEqual(mockIngredients[0]);
        expect(state.items).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.error).toBeUndefined();
      });

      it('заменяет текущий ингредиент новым', () => {
        const firstState = ingredientsReducer(
          initialState,
          setCurrentIngredient(mockIngredients[0])
        );

        const secondState = ingredientsReducer(
          firstState,
          setCurrentIngredient(mockIngredients[1])
        );

        expect(secondState.currentIngredient).toEqual(mockIngredients[1]);
      });

      it('корректно работает с соусом', () => {
        const state = ingredientsReducer(
          initialState,
          setCurrentIngredient(mockIngredients[2])
        );

        expect(state.currentIngredient).toEqual(mockIngredients[2]);
        expect(state.currentIngredient?.type).toBe('sauce');
      });
    });

    describe('clearCurrentIngredient', () => {
      it('очищает текущий ингредиент', () => {
        const stateWithIngredient = {
          ...initialState,
          currentIngredient: mockIngredients[0]
        };

        const action = clearCurrentIngredient();
        const state = ingredientsReducer(stateWithIngredient, action);

        expect(state.currentIngredient).toBeNull();
      });

      it('ничего не меняет, если ингредиент уже null', () => {
        const action = clearCurrentIngredient();
        const state = ingredientsReducer(initialState, action);

        expect(state).toEqual(initialState);
      });
    });
  });

  // 3. Тесты асинхронного thunk (fetchIngredients)
  describe('fetchIngredients async thunk', () => {
    describe('pending состояние', () => {
      it('устанавливает loading в true и очищает ошибку', () => {
        const stateWithError = {
          ...initialState,
          error: 'Предыдущая ошибка'
        };

        const action = { type: fetchIngredients.pending.type };
        const state = ingredientsReducer(stateWithError, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeUndefined();
        expect(state.items).toEqual([]);
        expect(state.currentIngredient).toBeNull();
      });
    });

    describe('fulfilled состояние', () => {
      it('заполняет items и сбрасывает loading', () => {
        const loadingState = {
          ...initialState,
          loading: true
        };

        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        };

        const state = ingredientsReducer(loadingState, action);

        expect(state.loading).toBe(false);
        expect(state.items).toEqual(mockIngredients);
        expect(state.error).toBeUndefined();
        expect(state.currentIngredient).toBeNull();
      });

      it('корректно обрабатывает пустой массив ингредиентов', () => {
        const loadingState = {
          ...initialState,
          loading: true
        };

        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: []
        };

        const state = ingredientsReducer(loadingState, action);

        expect(state.items).toEqual([]);
        expect(state.loading).toBe(false);
      });

      it('сохраняет текущий ингредиент при обновлении списка', () => {
        const stateWithIngredient = {
          ...initialState,
          loading: true,
          currentIngredient: mockIngredients[0]
        };

        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: [mockIngredients[1], mockIngredients[2]]
        };

        const state = ingredientsReducer(stateWithIngredient, action);

        expect(state.currentIngredient).toEqual(mockIngredients[0]);
        expect(state.items).toHaveLength(2);
      });
    });

    describe('rejected состояние', () => {
      it('сохраняет ошибку и сбрасывает loading', () => {
        const loadingState = {
          ...initialState,
          loading: true
        };

        const errorMessage = 'Не удалось загрузить ингредиенты';
        const action = {
          type: fetchIngredients.rejected.type,
          error: { message: errorMessage }
        };

        const state = ingredientsReducer(loadingState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.items).toEqual([]);
      });

      it('сохраняет items при ошибке', () => {
        const stateWithItems = {
          ...initialState,
          loading: true,
          items: [mockIngredients[0]]
        };

        const errorMessage = 'Ошибка сети';
        const action = {
          type: fetchIngredients.rejected.type,
          error: { message: errorMessage }
        };

        const state = ingredientsReducer(stateWithItems, action);

        expect(state.error).toBe(errorMessage);
        expect(state.items).toEqual([mockIngredients[0]]);
      });

      it('обрабатывает ошибку без message', () => {
        const loadingState = {
          ...initialState,
          loading: true
        };

        const action = {
          type: fetchIngredients.rejected.type,
          error: {}
        };

        const state = ingredientsReducer(loadingState, action);

        expect(state.error).toBe('Failed to fetch ingredients');
        expect(state.loading).toBe(false);
      });
    });
  });

  // 4. Интеграционные тесты
  describe('комбинированные сценарии', () => {
    it('полный цикл: установка ингредиента → загрузка → очистка', () => {
      // 1. Устанавливаем текущий ингредиент
      let state = ingredientsReducer(
        initialState,
        setCurrentIngredient(mockIngredients[0])
      );
      expect(state.currentIngredient).toEqual(mockIngredients[0]);

      // 2. Начинаем загрузку
      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.currentIngredient).toEqual(mockIngredients[0]);

      // 3. Успешная загрузка
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: [mockIngredients[1], mockIngredients[2]]
      });
      expect(state.loading).toBe(false);
      expect(state.items).toHaveLength(2);
      expect(state.currentIngredient).toEqual(mockIngredients[0]);

      // 4. Очищаем текущий ингредиент
      state = ingredientsReducer(state, clearCurrentIngredient());
      expect(state.currentIngredient).toBeNull();
      expect(state.items).toHaveLength(2);
    });

    it('загрузка с ошибкой → очистка ошибки через новую загрузку', () => {
      // 1. Ошибка загрузки
      let state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка 500' }
      });
      expect(state.error).toBe('Ошибка 500');

      // 2. Новая попытка загрузки (очищает ошибку)
      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.error).toBeUndefined();
      expect(state.loading).toBe(true);
    });
  });
});
