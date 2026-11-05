import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import { BTN_ICON, BTN_PRIMARY_H } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  colors?: string[];
  Icon?: LucideIcon;
  disabled?: boolean;
  textColor?: string;
  height?: number;
  width?: number | string;
  shadow?: 'primary' | 'amber';
  style?: StyleProp<ViewStyle>;
};

/**
 * Icon is always exactly BTN_ICON square and the label's lineHeight matches it,
 * so the glyph and the baseline can never drift apart.
 */
export function PrimaryButton({
  label,
  onPress,
  colors,
  Icon,
  disabled = false,
  textColor = theme.colors.text.onAccent,
  height = BTN_PRIMARY_H,
  width = '100%',
  shadow = 'primary',
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const gradient = colors || theme.gradients.primary;

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
          { height, transform: [{ scale }] },
          disabled ? styles.disabled : theme.shadows[shadow],
        ]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.grad, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={BTN_ICON} strokeWidth={1.5} color={textColor} /> : null}
            <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.45,
  },
  grad: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    lineHeight: BTN_ICON,
    fontWeight: '800',
    letterSpacing: 2,
  },
});

export default PrimaryButton;
