import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import theme from '../constants/theme';
import { BTN_SECONDARY_H } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type Tone = 'neutral' | 'danger' | 'accent';

type Props = {
  label: string;
  onPress: () => void;
  tone?: Tone;
  disabled?: boolean;
  height?: number;
  width?: number | string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
};

const TEXT: Record<Tone, string> = {
  neutral: theme.colors.text.secondary,
  danger: theme.colors.accent.danger,
  accent: theme.colors.accent.primary,
};

const BORDER: Record<Tone, string> = {
  neutral: 'rgba(255,255,255,0.12)',
  danger: 'rgba(224,83,59,0.50)',
  accent: 'rgba(138,164,200,0.42)',
};

/** Text-only by design — a clean glass button beats a crooked decorated one. */
export function SecondaryButton({
  label,
  onPress,
  tone = 'neutral',
  disabled = false,
  height = BTN_SECONDARY_H,
  width = '100%',
  fontSize = 13,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

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
      style={[{ width: width as number, height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.wrap,
          { height, borderColor: BORDER[tone], transform: [{ scale }] },
          disabled ? styles.disabled : null,
        ]}>
        <Text style={[styles.label, { color: TEXT[tone], fontSize }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 1.4,
    lineHeight: 20,
  },
});

export default SecondaryButton;
