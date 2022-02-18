import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import React from 'react';

import { useAppDispatch, useAppSelector } from '~/src/reduxStore';

type StatusType = 'loading' | 'success' | 'error';

const initialState: Partial<
  Record<string, { status: StatusType; data?: unknown; error?: unknown; timeStamp?: number }>
> = {};

export const apiRequests = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string>) => {
      state[action.payload] = {
        data: undefined,
        status: 'loading',
        timeStamp: undefined,
      };
    },
    fetchSuccessful: (state, action: PayloadAction<{ request: string; data: unknown }>) => {
      state[action.payload.request]!.status = 'success';
      state[action.payload.request]!.error = undefined;
      state[action.payload.request]!.data = action.payload.data;
      state[action.payload.request]!.timeStamp = new Date().getTime();
    },
    fetchError: (state, action: PayloadAction<{ request: string; error: unknown }>) => {
      state[action.payload.request]!.status = 'error';
      state[action.payload.request]!.error = action.payload.error;
      state[action.payload.request]!.data = undefined;
      state[action.payload.request]!.timeStamp = undefined;
    },
  },
});

const { startLoading, fetchSuccessful, fetchError } = apiRequests.actions;
export const requestsReducer = apiRequests.reducer;

export function useQuery<T>(key: string, fn: () => Promise<T>) {
  const ref = React.useRef(fn);
  const request = useAppSelector(state => state.requests[key]);

  const dispatch = useAppDispatch();

  const fetchFn = React.useCallback(() => {
    dispatch(startLoading(key));
    return ref
      .current()
      .then(data => dispatch(fetchSuccessful({ request: key, data })))
      .catch(error => dispatch(fetchError({ request: key, error })));
  }, [dispatch, ref, key]);

  React.useEffect(() => {
    ref.current = fn;
  }, [ref, fn]);

  React.useEffect(() => {
    const currentTimeStampMinusMinute = new Date();
    currentTimeStampMinusMinute.setSeconds(currentTimeStampMinusMinute.getSeconds() - 30);

    if (
      request?.data === undefined ||
      (request.timeStamp && request.timeStamp < currentTimeStampMinusMinute.getTime())
    ) {
      void fetchFn();
    }
  }, [request?.data, fetchFn, request?.timeStamp]);

  return {
    status: request?.status || 'loading',
    data: request?.data as T | undefined,
    refetch: fetchFn,
  };
}
