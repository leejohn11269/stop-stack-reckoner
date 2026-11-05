import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type StepProps = {
  symbol: string;
  label: string;
  onPress: () => void;
  disabled: boolean;
};

function StepButton({ symbol, label, onPress, disabled }: StepProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.step, disabled ? styles.stepDisabled : null, { transform: [{ scale }] }]}>
        <Text style={styles.symbol}>{symbol}</Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  value: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function ShutterStepper({ value, onPrev, onNext, canPrev, canNext }: Props) {
  return (
    <View style={styles.row}>
      <StepButton symbol="-" label="Slower shutter" onPress={onPrev} disabled={!canPrev} />
      <View style={styles.valueWrap}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <StepButton symbol="+" label="Faster shutter" onPress={onNext} disabled={!canNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
  },
  press: {
    width: 52,
    height: 52,
  },
  step: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glassStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: {
    opacity: 0.35,
  },
  symbol: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.accent.primary,
  },
  valueWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
});

export default ShutterStepper;
