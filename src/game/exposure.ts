export type ShutterEntry = {
  label: string;
  seconds: number;
};

/** Full-stop shutter ladder, 1/4000 ... 30 s (18 entries). */
export const SHUTTER_LADDER: ShutterEntry[] = [
  { label: '1/4000', seconds: 1 / 4000 },
  { label: '1/2000', seconds: 1 / 2000 },
  { label: '1/1000', seconds: 1 / 1000 },
  { label: '1/500', seconds: 1 / 500 },
  { label: '1/250', seconds: 1 / 250 },
  { label: '1/125', seconds: 1 / 125 },
  { label: '1/60', seconds: 1 / 60 },
  { label: '1/30', seconds: 1 / 30 },
  { label: '1/15', seconds: 1 / 15 },
  { label: '1/8', seconds: 1 / 8 },
  { label: '1/4', seconds: 1 / 4 },
  { label: '1/2', seconds: 1 / 2 },
  { label: '1s', seconds: 1 },
  { label: '2s', seconds: 2 },
  { label: '4s', seconds: 4 },
  { label: '8s', seconds: 8 },
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
];

export type BreakdownItem = {
  name: string;
  stops: number;
};

export type ExposureResult = {
  baseLabel: string;
  baseSeconds: number;
  stops: number;
  p: number;
  iso: number;
  seconds: number;
  breakdown: BreakdownItem[];
};

/**
 * Corrected exposure time.
 * Reciprocity failure only bites once the raw time passes one second.
 */
export function computeExposure(baseSeconds: number, stops: number, p: number): number {
  const raw = baseSeconds * Math.pow(2, stops);
  const corrected = raw > 1 ? Math.pow(raw, p) : raw;
  if (!isFinite(corrected) || corrected <= 0) {
    return 0;
  }
  return corrected < 60 ? Math.round(corrected * 10) / 10 : Math.round(corrected);
}

/** Human-readable exposure: "1/250", "8.2 s", "4 min 16 s", "1 h 12 min". */
export function formatExposure(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) {
    return '0.0 s';
  }
  if (seconds < 1) {
    return '1/' + Math.max(1, Math.round(1 / seconds));
  }
  if (seconds < 60) {
    return seconds.toFixed(1) + ' s';
  }
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m + ' min ' + s + ' s';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h + ' h ' + m + ' min';
}
