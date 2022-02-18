import styled from '@emotion/native';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedScreenWrapper } from '~/src/AnimatedScreenWrapper';
import { FeedScreen, PostScreen, UserScreen } from '~/src/App';
import { useAppSelector } from '~/src/reduxStore';

type ScreenNamesType = 'Feed' | 'Post' | 'User';

type ScreenType = {
  screen: ScreenNamesType;
  params: Record<string, number>;
};

const initialState: {
  screen: ScreenNamesType;
  params: Record<string, number>;
  isPushed: boolean;
}[] = [
  { screen: 'Feed', params: {}, isPushed: true },
  { screen: 'Post', params: {}, isPushed: false },
  { screen: 'User', params: {}, isPushed: false },
];

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<ScreenType>) => {
      const screen = state.find(obj => obj.screen === action.payload.screen);
      if (screen) {
        screen.isPushed = true;
        screen.params = action.payload.params;
      }
    },
    goBack: state => {
      for (let i = state.length - 1; i >= 0; i--) {
        if (state[i].isPushed) {
          state[i].isPushed = false;
          break;
        }
      }
    },
  },
});

export const { navigate, goBack } = navigationSlice.actions;
export const navigationReducer = navigationSlice.reducer;

export function useScreenParams(screenName: ScreenNamesType) {
  return useAppSelector(
    state => state.navigation.find(({ screen }) => screen === screenName)?.params
  );
}

export function ScreenResolver() {
  const screens = useAppSelector(state => state.navigation);

  return (
    <StyledScreenWrapper>
      {screens.map(({ screen, isPushed }) => (
        <AnimatedScreenWrapper key={screen} isShown={isPushed}>
          {
            {
              Feed: <FeedScreen />,
              Post: <PostScreen />,
              User: <UserScreen />,
            }[screen]
          }
        </AnimatedScreenWrapper>
      ))}
    </StyledScreenWrapper>
  );
}

const StyledScreenWrapper = styled.View`
  flex: 1;
`;
