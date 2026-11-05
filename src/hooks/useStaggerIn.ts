import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/** One 0 -> 1 Animated.Value per item, released in sequence. */
export function useStaggerIn(count: number, delay = 70) {
  const values = useRef<Animated.Value[]>(
    Array.from({ length: count }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animations = values.map(value =>
      Animated.spring(value, {
        toValue: 1,
        tension: theme.animation.enter.tension,
        friction: theme.animation.enter.friction,
        useNativeDriver: true,
      }),
    );
    const runner = Animated.stagger(delay, animations);
    runner.start();
    return () => runner.stop();
  }, [values, delay]);

  return values;
}

export default useStaggerIn;
