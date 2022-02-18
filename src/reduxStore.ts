import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import { requestsReducer } from '~/src/apiRequests';
import { navigationReducer } from '~/src/navigation';

export const reduxStore = configureStore({
  reducer: {
    navigation: navigationReducer,
    requests: requestsReducer,
  },
});

export const useAppDispatch = () => useDispatch<typeof reduxStore.dispatch>();
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof reduxStore.getState>> =
  useSelector;
