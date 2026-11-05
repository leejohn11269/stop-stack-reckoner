import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Clock, Layers, SlidersHorizontal, Timer } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  BREAKDOWN_MAX_ROWS,
  HALF_BTN_W,
  TOAST_MS,
} from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import ResultReadout from '../components/ResultReadout';
import BreakdownRow from '../components/BreakdownRow';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Toast from '../components/Toast';
import type { ExposureResult } from '../game/exposure';

type Props = {
  result: ExposureResult;
  logged: boolean;
  onBulb: () => void;
  onAgain: () => void;
  onMenu: () => void;
  onSave: () => void;
};

export function ResultScreen({ result, logged, onBulb, onAgain, onMenu, onSave }: Props) {
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current !== null) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const handleSave = useCallback(() => {
    onSave();
    setToast(true);
    if (toastTimer.current !== null) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(false), TOAST_MS);
  }, [onSave]);

  const shown = result.breakdown.slice(0, BREAKDOWN_MAX_ROWS);
  const hidden = result.breakdown.length - shown.length;

  return (
    <ScreenBackground variant="result">
      <ScreenHeader
        title="CORRECTED EXPOSURE"
        leftSlot={
          <HeaderIconButton source={assets.iconPause} label="Back to stack" onPress={onAgain} />
        }
      />

      <View style={styles.body}>
        <ResultReadout
          seconds={result.seconds}
          baseLabel={result.baseLabel}
          stops={result.stops}
        />

        <View style={styles.statRow}>
          <View style={styles.statSlot}>
            <StatCard
              Icon={Clock}
              value={result.baseLabel}
              label="METERED"
              valueColor={theme.colors.accent.primary}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              Icon={Layers}
              value={result.stops.toFixed(1)}
              label="STOPS"
              valueColor={theme.colors.accent.amber}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              Icon={SlidersHorizontal}
              value={'p ' + result.p.toFixed(2)}
              label="RECIPROCITY"
              valueColor={theme.colors.text.primary}
            />
          </View>
        </View>

        <View style={styles.breakdown}>
          {shown.map((item, index) => (
            <BreakdownRow
              key={item.name + index}
              name={item.name}
              stops={item.stops}
              index={index}
            />
          ))}
          {hidden > 0 ? (
            <BreakdownRow
              name={'+' + hidden + ' MORE FILTERS'}
              stops={null}
              index={shown.length}
            />
          ) : null}
          <BreakdownRow
            name="TOTAL"
            stops={result.stops}
            total
            index={shown.length + (hidden > 0 ? 1 : 0)}
          />
        </View>
      </View>

      <View style={styles.controls}>
        <Text style={styles.hint} numberOfLines={1}>
          COVER THE VIEWFINDER · ISO {result.iso}
        </Text>

        <PrimaryButton
          label="START BULB TIMER"
          Icon={Timer}
          onPress={onBulb}
          colors={theme.gradients.amber}
          shadow="amber"
        />

        <View style={styles.row}>
          <SecondaryButton
            label="CALCULATE AGAIN"
            onPress={onAgain}
            tone="accent"
            width={HALF_BTN_W}
            fontSize={12}
          />
          <SecondaryButton
            label={logged ? 'LOGGED' : 'SAVE LOG'}
            onPress={handleSave}
            tone="neutral"
            width={HALF_BTN_W}
            fontSize={12}
          />
        </View>

        <Pressable
          onPress={onMenu}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back to menu"
          style={styles.tertiary}>
          <Text style={styles.tertiaryText}>BACK TO MENU</Text>
        </Pressable>
      </View>

      <Toast message="FRAME LOGGED" visible={toast} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  statRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  statSlot: {
    flex: 1,
  },
  breakdown: {
    flex: 1,
    marginTop: 10,
    gap: 6,
    overflow: 'hidden',
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: theme.colors.ui.controls,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.borderSoft,
  },
  hint: {
    marginBottom: 10,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.8,
    textAlign: 'center',
    color: theme.colors.accent.amber,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  tertiary: {
    marginTop: 4,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
});

export default ResultScreen;
