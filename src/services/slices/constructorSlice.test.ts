import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';

type ConstructorState = ReturnType<typeof constructorReducer>;

const baseIngredient = {
  _id: '1',
  name: 'Тестовый ингредиент',
  type: 'main' as const,
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png',
  __v: 0
};

const mockBun = {
  ...baseIngredient,
  type: 'bun' as const,
  name: 'Тестовая булка'
};

const createConstructorIngredient = (id: string) => ({
  ...baseIngredient,
  id
});

describe('constructorSlice reducer', () => {
  // 1. Тест начального состояния
  it('возвращает корректное начальное состояние', () => {
    const state = constructorReducer(undefined, { type: '' });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  // 2. Тесты синхронных редьюсеров
  describe('addBun', () => {
    it('добавляет булку в конструктор', () => {
      const state: ConstructorState = constructorReducer(
        undefined,
        addBun(mockBun)
      );

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('заменяет существующую булку новой', () => {
      const firstState = constructorReducer(undefined, addBun(mockBun));

      const anotherBun = { ...mockBun, _id: '2', name: 'Другая булка' };
      const secondState = constructorReducer(firstState, addBun(anotherBun));

      expect(secondState.bun).toEqual(anotherBun);
      expect(secondState.bun?._id).toBe('2');
    });
  });

  describe('addIngredient', () => {
    it('добавляет ингредиент в конструктор', () => {
      const ingredient = createConstructorIngredient('ingredient-1');
      const state: ConstructorState = constructorReducer(
        undefined,
        addIngredient(ingredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(baseIngredient._id);
      expect(state.ingredients[0].id).toBe('ingredient-1');
    });

    it('добавляет несколько ингредиентов', () => {
      const firstIngredient = createConstructorIngredient('first');
      let state = constructorReducer(undefined, addIngredient(firstIngredient));

      const secondIngredient = createConstructorIngredient('second');
      state = constructorReducer(state, addIngredient(secondIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('first');
      expect(state.ingredients[1].id).toBe('second');
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент по id', () => {
      const initialState: ConstructorState = {
        bun: mockBun,
        ingredients: [
          createConstructorIngredient('first'),
          createConstructorIngredient('second')
        ]
      };

      const state = constructorReducer(initialState, removeIngredient('first'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('second');
      expect(state.bun).toEqual(mockBun);
    });

    it('не меняет состояние при удалении несуществующего id', () => {
      const initialState: ConstructorState = {
        bun: null,
        ingredients: [createConstructorIngredient('existing')]
      };

      const state = constructorReducer(
        initialState,
        removeIngredient('non-existent-id')
      );

      expect(state).toEqual(initialState);
    });

    it('корректно работает с пустым массивом', () => {
      const initialState: ConstructorState = {
        bun: mockBun,
        ingredients: []
      };

      const state = constructorReducer(
        initialState,
        removeIngredient('any-id')
      );

      expect(state).toEqual(initialState);
    });
  });

  describe('moveIngredient', () => {
    const createIngredients = () => [
      createConstructorIngredient('first'),
      createConstructorIngredient('second'),
      createConstructorIngredient('third')
    ];

    it('меняет порядок ингредиентов в списке', () => {
      const initialState: ConstructorState = {
        bun: mockBun,
        ingredients: createIngredients()
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ from: 0, to: 2 })
      );

      const idsOrder = state.ingredients.map((item) => item.id);
      expect(idsOrder).toEqual(['second', 'third', 'first']);
      expect(state.bun).toEqual(mockBun);
    });

    it('не изменяет порядок при некорректных индексах', () => {
      const initialState: ConstructorState = {
        bun: mockBun,
        ingredients: createIngredients()
      };

      const testCases = [
        { from: 10, to: 0 },
        { from: 0, to: 10 },
        { from: -1, to: 1 },
        { from: 1, to: -1 },
        { from: 1, to: 1 }
      ];

      testCases.forEach(({ from, to }) => {
        const state = constructorReducer(
          initialState,
          moveIngredient({ from, to })
        );
        expect(state).toEqual(initialState);
      });
    });

    it('корректно перемещает в начало', () => {
      const initialState: ConstructorState = {
        bun: null,
        ingredients: createIngredients()
      };

      const state = constructorReducer(
        initialState,
        moveIngredient({ from: 2, to: 0 })
      );

      const idsOrder = state.ingredients.map((item) => item.id);
      expect(idsOrder).toEqual(['third', 'first', 'second']);
    });
  });

  describe('clearConstructor', () => {
    it('полностью очищает конструктор', () => {
      const initialState: ConstructorState = {
        bun: mockBun,
        ingredients: [
          createConstructorIngredient('first'),
          createConstructorIngredient('second')
        ]
      };

      const state = constructorReducer(initialState, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    it('работает с пустым конструктором', () => {
      const initialState: ConstructorState = {
        bun: null,
        ingredients: []
      };

      const state = constructorReducer(initialState, clearConstructor());

      expect(state).toEqual(initialState);
    });
  });

  // 3. Интеграционные тесты
  describe('интеграционные сценарии', () => {
    it('полный цикл: добавление булки → ингредиентов → перемещение → удаление → очистка', () => {
      let state = constructorReducer(undefined, { type: '' });

      state = constructorReducer(state, addBun(mockBun));
      expect(state.bun).toEqual(mockBun);

      state = constructorReducer(
        state,
        addIngredient(createConstructorIngredient('1'))
      );
      state = constructorReducer(
        state,
        addIngredient(createConstructorIngredient('2'))
      );
      state = constructorReducer(
        state,
        addIngredient(createConstructorIngredient('3'))
      );
      expect(state.ingredients).toHaveLength(3);

      state = constructorReducer(state, moveIngredient({ from: 0, to: 2 }));
      expect(state.ingredients[0].id).toBe('2');

      state = constructorReducer(state, removeIngredient('2'));
      expect(state.ingredients).toHaveLength(2);

      state = constructorReducer(state, clearConstructor());
      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
  });
});
