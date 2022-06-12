import { configureStore } from '@reduxjs/toolkit';

import categoriesReducer from './categoriesSlice';
import productReducer from './productSlice';

const store = configureStore({
  reducer: {
    category: categoriesReducer,
    product: productReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
