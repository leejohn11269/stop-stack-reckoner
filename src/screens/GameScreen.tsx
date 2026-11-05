import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calculator, Settings } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  CHIP_GAP,
  DEFAULT_ISO,
  DEFAULT_SHUTTER_INDEX,
  GRID_W,
  MAX_STOPS,
} from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import GlassPanel from '../components/GlassPanel';
import ShutterStepper from '../components/ShutterStepper';
import IsoChips from '../components/IsoChips';
import StackPreview from '../components/StackPreview';
import FilterChip from '../components/FilterChip';
import StatStrip from '../components/StatStrip';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ReciprocitySheet from '../components/ReciprocitySheet';
import usePressScale from '../hooks/usePressScale';
import { FILTERS } from '../game/filters';
import { SHUTTER_LADDER } from '../game/exposure';
import type { ExposureResult } from '../game/exposure';
import {
  addFilter,
  buildResult,
  clearStack,
  countOf,
  kitStack,
  totalStops,
} from '../game/stack';
import type { StackEntry } from '../game/stack';

type Props = {
  recip: number;
  onRecipChange: (value: number) => void;
  onHome: () => void;
  onCalculate: (result: ExposureResult) => void;
};

function KitButton({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Load my kit"
      style={styles.kitPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.kitPill, { transform: [{ scale }] }]}>
        <Text style={styles.kitText}>LOAD MY KIT</Text>
      </Animated.View>
    </Pressable>
  );
}

export function GameScreen({ recip, onRecipChange, onHome, onCalculate }: Props) {
  // The saved kit is already screwed on when the screen opens.
  const [stack, setStack] = useState<StackEntry[]>(kitStack);
  const [shutterIndex, setShutterIndex] = useState(DEFAULT_SHUTTER_INDEX);
  const [iso, setIso] = useState(DEFAULT_ISO);
  const [sheetOpen, setSheetOpen] = useState(false);
  const headerIn = useRef(new Animated.Value(0)).current;

  const stops = totalStops(stack);
  const base = SHUTTER_LADDER[shutterIndex];

  useEffect(() => {
    Animated.timing(headerIn, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [headerIn]);

  const handleChipPress = useCallback((id: string) => {
    setStack(prev => addFilter(prev, id));
  }, []);

  const handleClear = useCallback(() => setStack(clearStack()), []);
  const handleKit = useCallback(() => setStack(kitStack()), []);
  const handlePrev = useCallback(() => setShutterIndex(i => Math.max(0, i - 1)), []);
  const handleNext = useCallback(
    () => setShutterIndex(i => Math.min(SHUTTER_LADDER.length - 1, i + 1)),
    [],
  );
  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const handleCalculate = useCallback(() => {
    onCalculate(buildResult(SHUTTER_LADDER[shutterIndex], stack, recip, iso));
  }, [onCalculate, shutterIndex, stack, recip, iso]);

  const cells = useMemo(
    () => [
      { label: 'BASE', value: base.label },
      { label: 'STOPS', value: stops.toFixed(1) },
      { label: 'RECIP', value: 'p ' + recip.toFixed(2) },
    ],
    [base.label, stops, recip],
  );

  const headerShift = headerIn.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });
  const full = stops >= MAX_STOPS;

  return (
    <ScreenBackground variant="game">
      <Animated.View
        pointerEvents="box-none"
        style={{ transform: [{ translateY: headerShift }] }}>
        <ScreenHeader
          title="FILTER STACK"
          leftSlot={
            <HeaderIconButton source={assets.iconHome} label="Back to menu" onPress={onHome} />
          }
          rightSlot={
            <HeaderIconButton Icon={Settings} label="Reciprocity tuner" onPress={openSheet} />
          }
        />
      </Animated.View>

      <View style={styles.body}>
        <GlassPanel style={styles.meter} radius={theme.radius.xl}>
          <Image
            source={assets.sprite4}
            style={styles.meterDecor}
            resizeMode="contain"
          />
          <Text style={styles.sectionLabel}>METERED SHUTTER</Text>
          <ShutterStepper
            value={base.label}
            onPrev={handlePrev}
            onNext={handleNext}
            canPrev={shutterIndex > 0}
            canNext={shutterIndex < SHUTTER_LADDER.length - 1}
          />
          <View style={styles.isoWrap}>
            <IsoChips value={iso} onChange={setIso} />
          </View>
        </GlassPanel>

        <View style={styles.previewWrap}>
          <StackPreview totalStops={stops} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.rowLabel} numberOfLines={1}>
            {full ? 'STACK FULL · 24 STOPS' : 'TAP FILTERS TO STACK'}
          </Text>
          <KitButton onPress={handleKit} />
        </View>

        <View style={styles.grid}>
          {FILTERS.map((filter, index) => (
            <FilterChip
              key={filter.id}
              id={filter.id}
              name={filter.name}
              stops={filter.stops}
              count={countOf(stack, filter.id)}
              active={countOf(stack, filter.id) > 0}
              index={index}
              onPress={handleChipPress}
            />
          ))}
        </View>
      </View>

      <StatStrip cells={cells} />

      <View style={styles.controls}>
        <SecondaryButton
          label="CLEAR STACK"
          onPress={handleClear}
          disabled={stack.length === 0}
        />
        <PrimaryButton
          label="CALCULATE"
          Icon={Calculator}
          onPress={handleCalculate}
          disabled={stops <= 0}
          colors={theme.gradients.primary}
          style={styles.cta}
        />
      </View>

      <ReciprocitySheet
        visible={sheetOpen}
        value={recip}
        onChange={onRecipChange}
        onClose={closeSheet}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  meter: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  meterDecor: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 68,
    height: 68,
    opacity: 0.26,
  },
  sectionLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  rowLabel: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  isoWrap: {
    marginTop: 10,
  },
  previewWrap: {
    marginTop: 10,
  },
  sectionRow: {
    marginTop: 12,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  kitPress: {
    width: 118,
    height: 34,
  },
  kitPill: {
    width: 118,
    height: 34,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(242,193,78,0.35)',
    backgroundColor: 'rgba(242,193,78,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.accent.amber,
  },
  grid: {
    flex: 1,
    width: GRID_W,
    alignSelf: 'center',
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: CHIP_GAP,
    overflow: 'hidden',
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: theme.colors.ui.controls,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.borderSoft,
  },
  cta: {
    marginTop: 10,
  },
});

export default GameScreen;
