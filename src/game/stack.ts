import { MAX_STOPS } from '../constants/config';
import { DEFAULT_KIT, findFilter } from './filters';
import { computeExposure } from './exposure';
import type { BreakdownItem, ExposureResult, ShutterEntry } from './exposure';

export type StackEntry = {
  id: string;
  count: number;
};

export function totalStops(stack: StackEntry[]): number {
  return stack.reduce((sum, entry) => {
    const f = findFilter(entry.id);
    return sum + (f ? f.stops * entry.count : 0);
  }, 0);
}

/** Screwing one more filter on. Rejected once the stack would pass the cap. */
export function addFilter(stack: StackEntry[], id: string): StackEntry[] {
  const f = findFilter(id);
  if (!f) {
    return stack;
  }
  if (totalStops(stack) + f.stops > MAX_STOPS) {
    return stack;
  }
  const existing = stack.find(entry => entry.id === id);
  if (existing) {
    return stack.map(entry =>
      entry.id === id ? { id: entry.id, count: entry.count + 1 } : entry,
    );
  }
  return stack.concat([{ id, count: 1 }]);
}

export function removeFilter(stack: StackEntry[], id: string): StackEntry[] {
  return stack
    .map(entry => (entry.id === id ? { id: entry.id, count: entry.count - 1 } : entry))
    .filter(entry => entry.count > 0);
}

export function clearStack(): StackEntry[] {
  return [];
}

export function kitStack(): StackEntry[] {
  return DEFAULT_KIT.map(id => ({ id, count: 1 }));
}

export function countOf(stack: StackEntry[], id: string): number {
  const entry = stack.find(e => e.id === id);
  return entry ? entry.count : 0;
}

export function breakdown(stack: StackEntry[]): BreakdownItem[] {
  return stack.map(entry => {
    const f = findFilter(entry.id);
    const name = f ? f.name : entry.id.toUpperCase();
    const stops = f ? f.stops * entry.count : 0;
    return { name: entry.count > 1 ? name + ' x' + entry.count : name, stops };
  });
}

export function buildResult(
  base: ShutterEntry,
  stack: StackEntry[],
  p: number,
  iso: number,
): ExposureResult {
  const stops = totalStops(stack);
  return {
    baseLabel: base.label,
    baseSeconds: base.seconds,
    stops,
    p,
    iso,
    seconds: computeExposure(base.seconds, stops, p),
    breakdown: breakdown(stack),
  };
}
