import styled from '@emotion/native';
import React from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

export function AnimatedScreenWrapper(props: { isShown: boolean; children: React.ReactNode }) {
  const { isShown, children } = props;
  const [isShownAfterAnimation, setIsShown] = React.useState(isShown);
  const animatedValue = React.useRef(new Animated.Value(0));

  const animate = (toValue: number, cb?: () => void) => {
    Animated.timing(animatedValue.current, {
      duration: 500,
      toValue,
      useNativeDriver: true,
    }).start(cb);
  };

  React.useEffect(() => {
    if (isShown) {
      setIsShown(true);
      animate(1);
    } else {
      animate(0, () => setIsShown(false));
    }
  }, [isShown]);

  if (!isShownAfterAnimation) {
    return null;
  }

  return (
    <StyledView
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [
            {
              translateX: animatedValue.current.interpolate({
                inputRange: [0, 1],
                outputRange: [Dimensions.get('window').width, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </StyledView>
  );
}

const StyledView = styled(Animated.View)`
  background-color: white;
`;
