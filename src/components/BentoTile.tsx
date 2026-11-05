import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
  decor?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

/** The Menu's big call-to-action tile (bento hub, left column). */
export function BentoTile({ Icon, title, subtitle, onPress, decor, style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrap, theme.shadows.primary, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.tile}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {decor ? (
          <Image source={decor} style={styles.decor} resizeMode="contain" />
        ) : null}
        <View pointerEvents="none" style={styles.topLine} />
        <View style={styles.content}>
          <Icon size={34} strokeWidth={1.5} color={theme.colors.accent.amber} />
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: '100%',
  },
  wrap: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(138,164,200,0.30)',
    backgroundColor: 'rgba(138,164,200,0.14)',
    overflow: 'hidden',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  decor: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 86,
    height: 86,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
});

export default BentoTile;
