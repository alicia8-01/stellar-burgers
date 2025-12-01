import userReducer, {
  loginUser,
  registerUser,
  updateUser,
  checkUserAuth,
  logoutUser,
  clearError
} from './userSlice';

type UserState = ReturnType<typeof userReducer>;

const mockUser = {
  name: 'Test User',
  email: 'test@example.com'
};

const mockUpdatedUser = {
  name: 'Updated User',
  email: 'updated@example.com'
};

describe('userSlice reducer', () => {
  // 1. Тест начального состояния
  it('возвращает корректное начальное состояние', () => {
    const state = userReducer(undefined, { type: '' });

    expect(state).toEqual({
      user: null,
      isAuth: false,
      loading: false,
      error: undefined
    });
  });

  // loginUser
  it('ставит loading в true и очищает ошибку при loginUser.pending', () => {
    const state: UserState = userReducer(undefined, {
      type: loginUser.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет пользователя, выставляет isAuth и сбрасывает loading при loginUser.fulfilled', () => {
    const loadingState: UserState = userReducer(undefined, {
      type: loginUser.pending.type
    });

    const state: UserState = userReducer(loadingState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет ошибку и сбрасывает loading при loginUser.rejected', () => {
    const loadingState: UserState = userReducer(undefined, {
      type: loginUser.pending.type
    });

    const errorMessage = 'Login failed';

    const state: UserState = userReducer(loadingState, {
      type: loginUser.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuth).toBe(false);
  });

  // registerUser
  it('ставит loading в true и очищает ошибку при registerUser.pending', () => {
    const state: UserState = userReducer(undefined, {
      type: registerUser.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('сохраняет пользователя и isAuth при registerUser.fulfilled', () => {
    const loadingState: UserState = userReducer(undefined, {
      type: registerUser.pending.type
    });

    const state: UserState = userReducer(loadingState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    });

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
  });

  it('сохраняет ошибку и сбрасывает loading при registerUser.rejected', () => {
    const loadingState: UserState = userReducer(undefined, {
      type: registerUser.pending.type
    });

    const errorMessage = 'Register failed';

    const state: UserState = userReducer(loadingState, {
      type: registerUser.rejected.type,
      error: { message: errorMessage }
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuth).toBe(false);
  });

  // updateUser
  describe('updateUser async thunk', () => {
    it('ставит loading в true и очищает ошибку при pending', () => {
      const state: UserState = userReducer(undefined, {
        type: updateUser.pending.type
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeUndefined();
    });

    it('обновляет пользователя при fulfilled', () => {
      const stateWithUser: UserState = {
        user: mockUser,
        isAuth: true,
        loading: true,
        error: undefined
      };

      const state: UserState = userReducer(stateWithUser, {
        type: updateUser.fulfilled.type,
        payload: mockUpdatedUser
      });

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUpdatedUser);
      expect(state.isAuth).toBe(true);
    });

    it('сохраняет ошибку при rejected', () => {
      const stateWithUser: UserState = {
        user: mockUser,
        isAuth: true,
        loading: true,
        error: undefined
      };

      const errorMessage = 'Update failed';

      const state: UserState = userReducer(stateWithUser, {
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toEqual(mockUser);
    });
  });

  it('ставит loading в true при checkUserAuth.pending', () => {
    const state: UserState = userReducer(undefined, {
      type: checkUserAuth.pending.type
    });

    expect(state.loading).toBe(true);
  });

  it('сохраняет пользователя и isAuth при checkUserAuth.fulfilled', () => {
    const loadingState: UserState = userReducer(undefined, {
      type: checkUserAuth.pending.type
    });

    const state: UserState = userReducer(loadingState, {
      type: checkUserAuth.fulfilled.type,
      payload: mockUser
    });

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuth).toBe(true);
  });

  it('сбрасывает пользователя и isAuth при checkUserAuth.rejected', () => {
    const loadingState: UserState = userReducer(undefined, {
      type: checkUserAuth.pending.type
    });

    const state: UserState = userReducer(loadingState, {
      type: checkUserAuth.rejected.type
    });

    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
  });

  it('обнуляет пользователя и isAuth при logoutUser.fulfilled', () => {
    const authedState: UserState = {
      user: mockUser,
      isAuth: true,
      loading: false,
      error: 'Какая-то ошибка'
    };

    const state: UserState = userReducer(authedState, {
      type: logoutUser.fulfilled.type
    });

    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.error).toBeUndefined();
  });

  it('очищает error при clearError', () => {
    const errorState: UserState = {
      user: null,
      isAuth: false,
      loading: false,
      error: 'Something went wrong'
    };

    const state: UserState = userReducer(errorState, clearError());

    expect(state.error).toBeUndefined();
  });

  // Интеграционный тест
  it('полный сценарий: логин → обновление → выход', () => {
    let state = userReducer(undefined, { type: '' });

    state = userReducer(state, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);

    state = userReducer(state, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.isAuth).toBe(true);

    state = userReducer(state, { type: updateUser.pending.type });
    expect(state.loading).toBe(true);

    state = userReducer(state, {
      type: updateUser.fulfilled.type,
      payload: mockUpdatedUser
    });
    expect(state.user).toEqual(mockUpdatedUser);

    state = userReducer(state, { type: logoutUser.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
  });
});
