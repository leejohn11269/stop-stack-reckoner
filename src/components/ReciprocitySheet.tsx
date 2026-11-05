import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { BODY_W, RECIPROCITY_STEPS } from '../constants/config';
import SecondaryButton from './SecondaryButton';
import usePressScale from '../hooks/usePressScale';

const STEP_COLS = 6;
const STEP_GAP = 8;
const STEP_W = Math.floor((BODY_W - (STEP_COLS - 1) * STEP_GAP) / STEP_COLS);

type StepProps = {
  value: number;
  active: boolean;
  onPress: (value: number) => void;
};

function StepTarget({ value, active, onPress }: StepProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const handlePress = () => onPress(value);
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={'Reciprocity p ' + value.toFixed(2)}
      accessibilityState={{ selected: active }}
      style={styles.stepPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.step, active ? styles.stepActive : null, { transform: [{ scale }] }]}>
        <Text style={[styles.stepText, active ? styles.stepTextActive : null]} numberOfLines={1}>
          {value.toFixed(2)}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

type Props = {
  visible: boolean;
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
};

/** Stepped tap targets, not a drag slider — no gesture handler anywhere. */
export function ReciprocitySheet({ visible, value, onChange, onClose }: Props) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 1 : 0,
      tension: 60,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  if (!visible) {
    return null;
  }

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close reciprocity tuner"
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheetWrap, { transform: [{ translateY }] }]}>
        <Pressable style={styles.sheet} onPress={noop} accessibilityLabel="Reciprocity tuner">
          <View style={styles.grabber} />
          <Text style={styles.title}>RECIPROCITY CORRECTION</Text>
          <Text style={styles.value}>{'p ' + value.toFixed(2)}</Text>
          <View style={styles.grid}>
            {RECIPROCITY_STEPS.map(step => (
              <StepTarget key={step} value={step} active={step === value} onPress={onChange} />
            ))}
          </View>
          <Text style={styles.hint} numberOfLines={2}>
            FILM AND LONG SENSOR FRAMES NEED p ABOVE 1.00
          </Text>
          <SecondaryButton label="DONE" onPress={onClose} tone="accent" height={48} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function noop() {}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.ui.overlay,
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(20,26,35,0.98)',
    alignItems: 'center',
    gap: 10,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.accent.amber,
    fontVariant: ['tabular-nums'],
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: STEP_GAP,
  },
  stepPress: {
    width: STEP_W,
    height: 44,
  },
  step: {
    width: STEP_W,
    height: 44,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    borderColor: theme.colors.accent.amber,
    backgroundColor: 'rgba(242,193,78,0.20)',
  },
  stepText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.text.muted,
    fontVariant: ['tabular-nums'],
  },
  stepTextActive: {
    color: theme.colors.accent.amber,
  },
  hint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
});

export default ReciprocitySheet;
