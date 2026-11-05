import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Aperture, Camera, Layers, Moon, SlidersHorizontal, Sun, Timer } from 'lucide-react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { MENU_GRID_H } from '../constants/config';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { HeaderIconButton } from '../components/ScreenHeader';
import GlassPanel from '../components/GlassPanel';
import BentoTile from '../components/BentoTile';
import StatCard from '../components/StatCard';
import useStaggerIn from '../hooks/useStaggerIn';
import { DEFAULT_KIT_STOPS, FILTERS } from '../game/filters';

type Props = {
  shots: number;
  recip: number;
  nightMode: boolean;
  onToggleNight: () => void;
  onStart: () => void;
};

const TILE_COUNT = 5;

export function MenuScreen({ shots, recip, nightMode, onToggleNight, onStart }: Props) {
  const entries = useStaggerIn(TILE_COUNT, 80);

  const rise = (value: Animated.Value) => ({
    opacity: value,
    transform: [
      {
        translateY: value.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
      },
    ],
  });

  return (
    <ScreenBackground variant="menu">
      <ScreenHeader
        title="STOP STACK"
        leftSlot={<Image source={assets.logo} style={styles.mark} resizeMode="contain" />}
        rightSlot={
          <HeaderIconButton
            Icon={nightMode ? Sun : Moon}
            label={nightMode ? 'Night mode off' : 'Night mode on'}
            onPress={onToggleNight}
            color={nightMode ? theme.night.accent : theme.colors.accent.primary}
          />
        }
      />

      <View style={styles.body}>
        <Animated.View pointerEvents="box-none" style={rise(entries[0])}>
          <GlassPanel style={styles.logPill} radius={theme.radius.md}>
            <Camera size={18} strokeWidth={1.5} color={theme.colors.accent.primary} />
            <Text style={styles.logLabel}>FIELD LOG</Text>
            <View style={styles.spacer} />
            <Text style={styles.logValue}>{shots > 0 ? shots + ' FRAMES' : 'READY'}</Text>
          </GlassPanel>
        </Animated.View>

        <Text style={styles.hint} numberOfLines={1}>
          COVER THE VIEWFINDER BEFORE A LONG FRAME
        </Text>

        <View style={styles.grid}>
          <Animated.View pointerEvents="box-none" style={[styles.ctaCol, rise(entries[1])]}>
            <BentoTile
              Icon={Timer}
              title="START EXPOSURE"
              subtitle="meter · stack · shoot"
              onPress={onStart}
              decor={assets.sprite1}
            />
          </Animated.View>

          <View style={styles.statCol}>
            <Animated.View pointerEvents="box-none" style={[styles.statSlot, rise(entries[2])]}>
              <StatCard
                Icon={Layers}
                value={String(FILTERS.length)}
                label="ND LIBRARY"
                valueColor={theme.colors.accent.primary}
              />
            </Animated.View>
            <Animated.View pointerEvents="box-none" style={[styles.statSlot, rise(entries[3])]}>
              <StatCard
                Icon={Aperture}
                value={DEFAULT_KIT_STOPS.toFixed(1)}
                label="MY KIT STOPS"
                valueColor={theme.colors.accent.amber}
              />
            </Animated.View>
            <Animated.View pointerEvents="box-none" style={[styles.statSlot, rise(entries[4])]}>
              <StatCard
                Icon={SlidersHorizontal}
                value={'p ' + recip.toFixed(2)}
                label="CORRECTION"
                valueColor={theme.colors.text.primary}
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText} numberOfLines={1}>
            OFFLINE · NO SIGNAL NEEDED
          </Text>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 30,
    height: 30,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  logPill: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  logLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.secondary,
  },
  spacer: {
    flex: 1,
  },
  logValue: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.accent.amber,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  grid: {
    height: MENU_GRID_H,
    flexDirection: 'row',
    gap: 12,
  },
  ctaCol: {
    flex: 1.25,
  },
  statCol: {
    flex: 1,
    gap: 12,
  },
  statSlot: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  footerText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.faint,
  },
});

export default MenuScreen;
