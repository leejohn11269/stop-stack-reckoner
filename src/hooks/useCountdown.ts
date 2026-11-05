import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Bulb countdown. The live value lives in a ref so the interval callback
 * never reads stale state; it is mirrored into state once per second.
 */
export function useCountdown(totalSeconds: number) {
  const remainingRef = useRef(totalSeconds);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timerRef.current !== null || remainingRef.current <= 0) {
      return;
    }
    setRunning(true);
    setDone(false);
    timerRef.current = setInterval(() => {
      const next = Math.max(0, remainingRef.current - 1);
      remainingRef.current = next;
      setRemaining(next);
      if (next <= 0) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRunning(false);
        setDone(true);
      }
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    stopTimer();
    setRunning(false);
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    remainingRef.current = totalSeconds;
    setRemaining(totalSeconds);
    setRunning(false);
    setDone(false);
  }, [stopTimer, totalSeconds]);

  useEffect(() => {
    remainingRef.current = totalSeconds;
    setRemaining(totalSeconds);
    setDone(false);
  }, [totalSeconds]);

  useEffect(() => stopTimer, [stopTimer]);

  return { remaining, running, done, start, pause, reset };
}

export default useCountdown;
