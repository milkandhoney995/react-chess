import { configureStore } from '@reduxjs/toolkit';
import chessReducer from './slices/chessSlice';
import { chessApi } from './api/chessApi';

export const store = configureStore({
  reducer: {
    chess: chessReducer,
    [chessApi.reducerPath]: chessApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chessApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
