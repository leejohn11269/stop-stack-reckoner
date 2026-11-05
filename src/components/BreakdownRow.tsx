import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  name: string;
  stops: number | null;
  total?: boolean;
  index: number;
};

export function BreakdownRow({ name, stops, total = false, index }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      delay: index * 60,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter, index]);

  const translateX = enter.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });
  const accent = total ? theme.colors.accent.amber : theme.colors.accent.primary;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.row,
        total ? styles.rowTotal : null,
        { opacity: enter, transform: [{ translateX }] },
      ]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.name, total ? styles.nameTotal : null]} numberOfLines={1}>
        {name}
      </Text>
      {stops !== null ? (
        <Text style={[styles.stops, { color: accent }]} numberOfLines={1}>
          {'+' + stops.toFixed(1)}
        </Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  rowTotal: {
    backgroundColor: 'rgba(242,193,78,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(242,193,78,0.26)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  nameTotal: {
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  stops: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

export default BreakdownRow;
