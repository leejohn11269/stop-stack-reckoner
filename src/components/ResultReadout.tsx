import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { COUNT_UP_MS } from '../constants/config';
import { formatExposure } from '../game/exposure';

type Props = {
  seconds: number;
  baseLabel: string;
  stops: number;
};

const STEPS = 20;
const TICK = Math.round(COUNT_UP_MS / STEPS);

/** The hero number. Ticks up from zero so the reading lands with weight. */
export function ResultReadout({ seconds, baseLabel, stops }: Props) {
  const [shown, setShown] = useState(0);
  const cardScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    let step = 0;
    setShown(0);
    const id = setInterval(() => {
      step += 1;
      const t = step / STEPS;
      const eased = 1 - Math.pow(1 - t, 3);
      if (step >= STEPS) {
        clearInterval(id);
        setShown(seconds);
      } else {
        setShown(seconds * eased);
      }
    }, TICK);
    return () => clearInterval(id);
  }, [seconds]);

  useEffect(() => {
    Animated.spring(cardScale, {
      toValue: 1,
      tension: theme.animation.enter.tension,
      friction: theme.animation.enter.friction,
      useNativeDriver: true,
    }).start();
  }, [cardScale]);

  const text = formatExposure(shown);
  const fontSize = text.length > 9 ? 48 : 64;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.card, theme.shadows.amber, { transform: [{ scale: cardScale }] }]}>
      <Image source={assets.sprite2} style={styles.decor} resizeMode="contain" />
      <View pointerEvents="none" style={styles.topLine} />
      <Text style={[styles.value, { fontSize, lineHeight: fontSize + 8 }]} numberOfLines={1}>
        {text}
      </Text>
      <Text style={styles.sub} numberOfLines={1}>
        {'FROM ' + baseLabel + ' · +' + stops.toFixed(1) + ' STOPS'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(242,193,78,0.28)',
    backgroundColor: 'rgba(242,193,78,0.10)',
    overflow: 'hidden',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decor: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 92,
    height: 92,
    opacity: 0.25,
  },
  value: {
    fontWeight: '800',
    letterSpacing: -1,
    color: theme.colors.accent.amber,
    fontVariant: ['tabular-nums'],
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
});

export default ResultReadout;
