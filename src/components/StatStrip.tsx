import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type StatCell = {
  label: string;
  value: string;
};

type Props = {
  cells: StatCell[];
};

/** The thin readout bar under the working area — Game and Countdown share it. */
export function StatStrip({ cells }: Props) {
  if (cells.length < 2) {
    return null;
  }
  return (
    <View style={styles.strip}>
      {cells.map((cell, i) => (
        <View
          key={cell.label}
          style={[styles.cell, i > 0 ? styles.divider : null]}>
          <Text style={styles.label} numberOfLines={1}>
            {cell.label}
          </Text>
          <Text style={styles.value} numberOfLines={1}>
            {cell.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.borderSoft,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.ui.divider,
  },
  label: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
  value: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
});

export default StatStrip;
