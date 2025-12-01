import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk('feed/getAll', getFeedsApi);

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | undefined;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: undefined
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    startFeed: (state) => {
      state.loading = true;
      state.error = undefined;
    },
    stopFeed: (state) => {
      state.loading = false;
      state.error = undefined;
    },
    setFeedData: (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      });
  }
});

export default feedSlice.reducer;
