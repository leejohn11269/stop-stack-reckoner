import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { ISO_OPTIONS } from '../constants/config';
import usePressScale from '../hooks/usePressScale';

type ChipProps = {
  iso: number;
  active: boolean;
  onPress: (iso: number) => void;
};

function IsoChip({ iso, active, onPress }: ChipProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const handlePress = () => onPress(iso);
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={'ISO ' + iso}
      accessibilityState={{ selected: active }}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.chip, active ? styles.chipActive : null, { transform: [{ scale }] }]}>
        <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
          {'ISO ' + iso}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  value: number;
  onChange: (iso: number) => void;
};

export function IsoChips({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {ISO_OPTIONS.map(iso => (
        <IsoChip key={iso} iso={iso} active={iso === value} onPress={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    height: 34,
  },
  press: {
    flex: 1,
    height: 34,
  },
  chip: {
    width: '100%',
    height: 34,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: 'rgba(138,164,200,0.16)',
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  labelActive: {
    color: theme.colors.text.primary,
  },
});

export default IsoChips;
