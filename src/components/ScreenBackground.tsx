import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'result' | 'countdown';

type Blob = {
  size: number;
  color: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type VariantConfig = {
  image: number;
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
  blobs: Blob[];
};

/**
 * One background image for the whole app; each screen is told apart by its
 * gradient overlay. The loader sits under the heaviest veil of the five.
 */
const VARIANTS: Record<BackgroundVariant, VariantConfig> = {
  loader: {
    image: 0.22,
    colors: ['rgba(5,7,10,0.94)', 'rgba(11,14,19,0.90)', 'rgba(14,17,22,0.96)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    blobs: [
      { size: 320, color: 'rgba(138,164,200,0.08)', top: -80, left: -110 },
      { size: 240, color: 'rgba(242,193,78,0.05)', bottom: -60, right: -70 },
    ],
  },
  menu: {
    image: 0.34,
    colors: ['rgba(14,17,22,0.78)', 'rgba(20,26,35,0.60)', 'rgba(16,23,34,0.82)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    blobs: [
      { size: 260, color: 'rgba(138,164,200,0.12)', top: -60, right: -70 },
      { size: 200, color: 'rgba(242,193,78,0.08)', bottom: 40, left: -60 },
    ],
  },
  game: {
    image: 0.26,
    colors: ['rgba(10,13,18,0.90)', 'rgba(16,21,28,0.84)', 'rgba(12,16,22,0.92)'],
    start: { x: 0, y: 0 },
    end: { x: 0.4, y: 1 },
    blobs: [{ size: 280, color: 'rgba(138,164,200,0.09)', top: 60, right: -110 }],
  },
  result: {
    image: 0.3,
    colors: ['rgba(16,23,34,0.82)', 'rgba(14,17,22,0.86)', 'rgba(32,24,8,0.86)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    blobs: [
      { size: 300, color: 'rgba(242,193,78,0.10)', bottom: -80, left: -80 },
      { size: 220, color: 'rgba(138,164,200,0.08)', top: -50, right: -60 },
    ],
  },
  countdown: {
    image: 0.12,
    colors: ['rgba(5,7,10,0.95)', 'rgba(10,13,18,0.93)', 'rgba(5,7,10,0.97)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    blobs: [{ size: 300, color: 'rgba(242,193,78,0.06)', top: 120, left: -120 }],
  },
};

type Props = {
  variant: BackgroundVariant;
  children?: React.ReactNode;
};

export function ScreenBackground({ variant, children }: Props) {
  const cfg = VARIANTS[variant];
  return (
    <View style={styles.root}>
      <ImageBackground
        source={assets.bgGame}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: cfg.image }}
      />
      <LinearGradient
        colors={cfg.colors}
        start={cfg.start}
        end={cfg.end}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {cfg.blobs.map((blob, i) => (
          <View
            key={'blob-' + i}
            style={[
              styles.blob,
              {
                width: blob.size,
                height: blob.size,
                borderRadius: blob.size / 2,
                backgroundColor: blob.color,
                top: blob.top,
                bottom: blob.bottom,
                left: blob.left,
                right: blob.right,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0E1116',
  },
  blob: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
});

export default ScreenBackground;
