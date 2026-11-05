import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '../constants/theme';
import { RING_GLOW_R, RING_R, RING_STROKE, RING_SVG } from '../constants/config';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCUMFERENCE = 2 * Math.PI * RING_R;
const CENTER = RING_SVG / 2;

type Props = {
  progress: Animated.Value;
  done: boolean;
  children?: React.ReactNode;
};

/**
 * strokeDashoffset cannot run on the native driver, so the sweep uses
 * useNativeDriver:false while the breathing scale stays on the GPU.
 */
export function BulbRing({ progress, done, children }: Props) {
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const dashOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.root}>
      <Animated.View pointerEvents="none" style={{ transform: [{ scale }] }}>
        <Svg width={RING_SVG} height={RING_SVG}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RING_GLOW_R}
            stroke={done ? 'rgba(242,193,78,0.34)' : 'rgba(242,193,78,0.16)'}
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RING_R}
            stroke="rgba(233,238,245,0.08)"
            strokeWidth={RING_STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={RING_R}
            stroke={theme.colors.accent.amber}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            rotation={-90}
            originX={CENTER}
            originY={CENTER}
          />
        </Svg>
      </Animated.View>
      <View pointerEvents="none" style={styles.center}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: RING_SVG,
    height: RING_SVG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BulbRing;
