import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { MAX_STOPS } from '../constants/config';

type Props = {
  totalStops: number;
};

/**
 * The signature effect: the strip physically stops down as filters pile up.
 * Only opacity is animated, so it stays on the native driver.
 */
export function StackPreview({ totalStops }: Props) {
  const darkness = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(darkness, {
      toValue: Math.min(totalStops / MAX_STOPS, 1) * 0.9,
      duration: 220,
      useNativeDriver: true,
    }).start();

    pulse.setValue(1.15);
    Animated.spring(pulse, {
      toValue: 1,
      tension: 120,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [totalStops, darkness, pulse]);

  return (
    <View style={styles.strip}>
      <LinearGradient
        colors={theme.gradients.strip}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.veil, { opacity: darkness }]}
      />
      <View style={styles.center}>
        <Animated.Text style={[styles.value, { transform: [{ scale: pulse }] }]}>
          {totalStops.toFixed(1) + ' STOPS'}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 48,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderSoft,
  },
  veil: {
    backgroundColor: '#05070A',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});

export default StackPreview;
