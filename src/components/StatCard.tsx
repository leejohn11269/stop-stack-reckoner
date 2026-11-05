import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The one stat pill in the app — Menu and Result share it, so the two screens
 * cannot drift. Width is '100%' (never flex:1) so the card keeps its intrinsic
 * height inside a flex:1 slot.
 */
export function StatCard({ Icon, value, label, valueColor, style }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }, style]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={22} strokeWidth={1.5} color={valueColor} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.glass,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  value: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.muted,
  },
});

export default StatCard;
