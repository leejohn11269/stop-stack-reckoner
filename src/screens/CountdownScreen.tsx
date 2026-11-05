import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, Vibration, View } from 'react-native';
import { Timer } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import BulbRing from '../components/BulbRing';
import StatStrip from '../components/StatStrip';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import useCountdown from '../hooks/useCountdown';
import { clock } from '../utils/format';
import { formatExposure } from '../game/exposure';
import type { ExposureResult } from '../game/exposure';

type Props = {
  result: ExposureResult;
  onClose: () => void;
  onAgain: () => void;
};

const DONE_PATTERN = [0, 400, 150, 400];

export function CountdownScreen({ result, onClose, onAgain }: Props) {
  const total = Math.max(1, Math.round(result.seconds));
  const { remaining, running, done, start, pause, reset } = useCountdown(total);
  const progress = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    start();
  }, [start]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (total - remaining) / total,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [remaining, total, progress]);

  useEffect(() => {
    if (!done) {
      return;
    }
    Vibration.vibrate(DONE_PATTERN);
    const pulses = Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0.35, duration: 220, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0.35, duration: 220, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]);
    pulses.start();
    return () => pulses.stop();
  }, [done, flash]);

  const handleToggle = useCallback(() => {
    if (running) {
      pause();
    } else {
      start();
    }
  }, [running, pause, start]);

  const handleStop = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const cells = [
    { label: 'BASE', value: result.baseLabel },
    { label: 'STOPS', value: result.stops.toFixed(1) },
    { label: 'TOTAL', value: formatExposure(result.seconds) },
  ];

  return (
    <ScreenBackground variant="countdown">
      <ScreenHeader
        title="BULB TIMER"
        leftSlot={
          <HeaderIconButton source={assets.iconPause} label="Back to result" onPress={onClose} />
        }
      />

      <View style={styles.body}>
        <Image
          source={assets.sprite3}
          style={styles.decor}
          resizeMode="contain"
        />

        <BulbRing progress={progress} done={done}>
          {done ? (
            <Animated.Text style={[styles.doneText, { opacity: flash }]}>
              EXPOSURE DONE
            </Animated.Text>
          ) : (
            <View style={styles.ringCenter}>
              <Text style={styles.of} numberOfLines={1}>
                {'OF ' + formatExposure(result.seconds)}
              </Text>
              <Text style={styles.time} numberOfLines={1}>
                {clock(remaining)}
              </Text>
              <Text style={styles.remaining} numberOfLines={1}>
                REMAINING
              </Text>
            </View>
          )}
        </BulbRing>
      </View>

      <StatStrip cells={cells} />

      <View style={styles.controls}>
        {done ? (
          <PrimaryButton
            label="SHOOT AGAIN"
            Icon={Timer}
            onPress={onAgain}
            colors={theme.gradients.amber}
            shadow="amber"
          />
        ) : (
          <SecondaryButton
            label={running ? 'PAUSE' : 'RESUME'}
            onPress={handleToggle}
            tone="accent"
            height={56}
            fontSize={15}
          />
        )}
        <SecondaryButton
          label="STOP"
          onPress={handleStop}
          tone="danger"
          style={styles.stop}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decor: {
    position: 'absolute',
    right: 16,
    top: 10,
    width: 96,
    height: 96,
    opacity: 0.24,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  of: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.accent.primary,
  },
  time: {
    marginTop: 4,
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  remaining: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.muted,
  },
  doneText: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.accent.amber,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: theme.colors.ui.controls,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.borderSoft,
  },
  stop: {
    marginTop: 10,
  },
});

export default CountdownScreen;
