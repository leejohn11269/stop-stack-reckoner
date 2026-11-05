import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Tint = 'neutral' | 'primary' | 'amber';

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: Tint;
  radius?: number;
};

const FILL: Record<Tint, string> = {
  neutral: theme.colors.ui.glass,
  primary: 'rgba(138,164,200,0.13)',
  amber: 'rgba(242,193,78,0.10)',
};

const BORDER: Record<Tint, string> = {
  neutral: theme.colors.ui.border,
  primary: 'rgba(138,164,200,0.30)',
  amber: 'rgba(242,193,78,0.28)',
};

/** The single surface primitive: fill + hairline border + light from above. */
export function GlassPanel({ children, style, tint = 'neutral', radius = theme.radius.lg }: Props) {
  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: FILL[tint], borderColor: BORDER[tint], borderRadius: radius },
        style,
      ]}>
      <View pointerEvents="none" style={[styles.highlight, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
});

export default GlassPanel;
