import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CHIP_H, CHIP_STAGGER_MS, CHIP_W } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type Props = {
  name: string;
  stops: number;
  count: number;
  active: boolean;
  index: number;
  onPress: (id: string) => void;
  id: string;
};

export function FilterChip({ name, stops, count, active, index, onPress, id }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const { scale, onPressIn, onPressOut } = usePressScale(0.93);

  useEffect(() => {
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 200,
      delay: index * CHIP_STAGGER_MS,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter, index]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  const handlePress = () => onPress(id);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={name + ' ' + stops.toFixed(1) + ' stops'}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          active ? styles.chipActive : null,
          { opacity: enter, transform: [{ translateY }, { scale }] },
        ]}>
        <Text style={[styles.name, active ? styles.nameActive : null]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.stops} numberOfLines={1}>
          {stops.toFixed(1)}
        </Text>
        {active ? <View pointerEvents="none" style={styles.dot} /> : null}
        {count > 1 ? (
          <View pointerEvents="none" style={styles.badge}>
            <Text style={styles.badgeText}>{'x' + count}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: CHIP_W,
    height: CHIP_H,
  },
  chip: {
    width: CHIP_W,
    height: CHIP_H,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.045)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.accent.primary,
    backgroundColor: 'rgba(138,164,200,0.20)',
  },
  name: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: theme.colors.text.secondary,
  },
  nameActive: {
    color: theme.colors.text.primary,
  },
  stops: {
    marginTop: 1,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
    fontVariant: ['tabular-nums'],
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.amber,
  },
  badge: {
    position: 'absolute',
    bottom: 4,
    right: 5,
    paddingHorizontal: 4,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,193,78,0.22)',
  },
  badgeText: {
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '800',
    color: theme.colors.accent.amber,
  },
});

export default React.memo(FilterChip);
