import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_W = width;
export const SCREEN_H = height;

/** Splash duration. MUST stay 8000 — shorter races the UI-test screenshot window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;
export const PROGRESS_W = 190;

/** Header geometry — paddingTop keeps content clear of the status bar. */
export const HEADER_TOP_PAD = 44;
export const HEADER_BAR_H = 56;
export const HEADER_H = HEADER_TOP_PAD + HEADER_BAR_H;

/** Body geometry. */
export const BODY_PAD_H = 16;
export const BODY_W = SCREEN_W - BODY_PAD_H * 2;
export const HALF_BTN_GAP = 10;
export const HALF_BTN_W = Math.floor((BODY_W - HALF_BTN_GAP) / 2);

/** Filter-chip grid — computed from the frame, never hardcoded. */
export const GRID_W = Math.min(SCREEN_W - 32, 380);
export const CHIP_GAP = 10;
export const CHIP_COLS = 4;
export const CHIP_ROWS = 3;
export const CHIP_W = Math.floor((GRID_W - (CHIP_COLS - 1) * CHIP_GAP) / CHIP_COLS);

const GAME_RESERVED =
  HEADER_H + 42 /* stat strip */ + 150 /* controls */ + 12 /* body top */ +
  142 /* meter card */ + 10 + 48 /* preview strip */ + 12 + 34 /* section row */ + 8 + 12;

export const CHIP_H = Math.max(
  44,
  Math.min(56, Math.floor((SCREEN_H - GAME_RESERVED - (CHIP_ROWS - 1) * CHIP_GAP) / CHIP_ROWS)),
);

/** Menu bento grid height — resolved up front so no flex:1 nests inside flex:1. */
const MENU_AVAIL = SCREEN_H - HEADER_H - 12 - 44 - 12 - 18 - 12 - 36;
export const MENU_GRID_H = Math.max(300, Math.min(MENU_AVAIL, 480));

/** Bulb-countdown ring. */
export const RING_R = Math.max(86, Math.min(110, Math.floor((SCREEN_W - 110) / 2)));
export const RING_GLOW_R = RING_R + 6;
export const RING_STROKE = 3;
export const RING_SVG = (RING_GLOW_R + 8) * 2;

/** Buttons. */
export const BTN_PRIMARY_H = 58;
export const BTN_SECONDARY_H = 46;
export const BTN_ICON = 24;

/** Exposure defaults. */
export const DEFAULT_SHUTTER_INDEX = 5; // 1/125
export const ISO_OPTIONS = [100, 200, 400];
export const DEFAULT_ISO = 100;
export const DEFAULT_RECIPROCITY = 1.0;
export const RECIPROCITY_STEPS = [
  1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5,
];
export const MAX_STOPS = 24;

/** Result breakdown — how many filter rows before the "+N MORE" row. */
export const BREAKDOWN_MAX_ROWS = 2;

/** Timing. */
export const CHIP_STAGGER_MS = 60;
export const COUNT_UP_MS = 650;
export const TOAST_MS = 1400;
