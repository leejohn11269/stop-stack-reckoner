import { useCallback, useState } from 'react';
import type { ExposureResult } from '../game/exposure';

export type FieldLogEntry = {
  ts: number;
  baseLabel: string;
  stops: number;
  seconds: number;
  p: number;
  iso: number;
};

/** In-memory field log — no persistence library, the app is fully offline. */
export function useFieldLog() {
  const [entries, setEntries] = useState<FieldLogEntry[]>([]);

  const logShot = useCallback((result: ExposureResult) => {
    setEntries(prev =>
      prev.concat([
        {
          ts: Date.now(),
          baseLabel: result.baseLabel,
          stops: result.stops,
          seconds: result.seconds,
          p: result.p,
          iso: result.iso,
        },
      ]),
    );
  }, []);

  return { entries, logShot, count: entries.length };
}

export default useFieldLog;
