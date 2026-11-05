/** Seconds -> mm:ss (or h:mm:ss past an hour). */
export function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  if (h > 0) {
    return h + ':' + pad(m) + ':' + pad(sec);
  }
  return pad(m) + ':' + pad(sec);
}
