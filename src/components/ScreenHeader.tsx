import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import { HEADER_BAR_H, HEADER_H, HEADER_TOP_PAD } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type IconButtonProps = {
  onPress: () => void;
  label: string;
  Icon?: LucideIcon;
  source?: ImageSourcePropType;
  color?: string;
};

/** 48x48 glass circle used in every header slot. */
export function HeaderIconButton({ onPress, label, Icon, source, color }: IconButtonProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);
  const tint = color || theme.colors.accent.primary;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.iconBtn}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.iconBtnInner, { transform: [{ scale }] }]}>
        {Icon ? <Icon size={22} strokeWidth={1.5} color={tint} /> : null}
        {source ? <Image source={source} style={styles.iconImage} resizeMode="contain" /> : null}
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/** Shared across Menu / Game / Result / Countdown so the chrome never drifts. */
export function ScreenHeader({ title, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.bar}>
        <View style={styles.slot}>{leftSlot ? leftSlot : null}</View>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.slot}>{rightSlot ? rightSlot : null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_H,
    paddingTop: HEADER_TOP_PAD,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.ui.header,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.borderSoft,
  },
  bar: {
    height: HEADER_BAR_H,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: theme.colors.text.primary,
  },
  iconBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});

export default ScreenHeader;
