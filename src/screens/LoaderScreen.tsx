import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';
import ScreenBackground from '../components/ScreenBackground';
import { LOADER_DURATION_MS, LOADER_FADE_MS, PROGRESS_W } from '../constants/config';

type Props = {
  onDone: () => void;
};

export function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const logoIn = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.spring(logoIn, {
      toValue: 1,
      tension: 42,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleIn, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();

    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(halo, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ]),
    );
    haloLoop.start();

    // width cannot run on the native driver
    const bar = Animated.timing(progress, {
      toValue: PROGRESS_W,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    });
    bar.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          doneRef.current();
        }
      });
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => {
      clearTimeout(timer);
      haloLoop.stop();
      bar.stop();
    };
  }, [fade, logoIn, titleIn, halo, progress]);

  const logoScale = logoIn.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
  const titleShift = titleIn.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const haloScale = halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const haloOpacity = halo.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.35] });

  return (
    <ScreenBackground variant="loader">
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <Image
          source={assets.sprite5}
          style={styles.decor}
          resizeMode="contain"
        />

        <View style={styles.center}>
          <View style={styles.logoBlock}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.halo,
                { opacity: haloOpacity, transform: [{ scale: haloScale }] },
              ]}
            />
            <Animated.Image
              source={assets.logo}
              resizeMode="contain"
              style={[
                styles.logo,
                { opacity: logoIn, transform: [{ scale: logoScale }] },
              ]}
            />
          </View>

          <View style={styles.hairline} />

          <Animated.View
            pointerEvents="box-none"
            style={{ opacity: titleIn, transform: [{ translateY: titleShift }] }}>
            <Text style={styles.title}>STOP STACK</Text>
            <Text style={styles.subtitle}>ND EXPOSURE RECKONER</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.track}>
            <Animated.View pointerEvents="none" style={[styles.fill, { width: progress }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>CALIBRATING...</Text>
          <Text style={styles.offline}>OFFLINE · FIELD READY</Text>
        </View>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  decor: {
    position: 'absolute',
    right: 18,
    bottom: 120,
    width: 120,
    height: 120,
    opacity: 0.26,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBlock: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(138,164,200,0.16)',
  },
  logo: {
    width: 132,
    height: 132,
  },
  hairline: {
    width: 180,
    height: 1,
    marginTop: 14,
    marginBottom: 20,
    backgroundColor: 'rgba(233,238,245,0.10)',
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: 6,
    textAlign: 'center',
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(138,164,200,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 18,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 3.5,
    textAlign: 'center',
    color: theme.colors.accent.primary,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  track: {
    width: PROGRESS_W,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(233,238,245,0.08)',
  },
  fill: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  offline: {
    marginTop: 18,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.faint,
  },
});

export default LoaderScreen;
