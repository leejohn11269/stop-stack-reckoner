export type FilterDef = {
  id: string;
  name: string;
  stops: number;
};

/** 12 neutral-density filters — 4 columns x 3 rows on the chip grid. */
export const FILTERS: FilterDef[] = [
  { id: 'nd2', name: 'ND2', stops: 1 },
  { id: 'nd4', name: 'ND4', stops: 2 },
  { id: 'nd8', name: 'ND8', stops: 3 },
  { id: 'nd16', name: 'ND16', stops: 4 },
  { id: 'nd32', name: 'ND32', stops: 5 },
  { id: 'nd64', name: 'ND64', stops: 6 },
  { id: 'nd100', name: 'ND100', stops: 6.6 },
  { id: 'nd400', name: 'ND400', stops: 8.6 },
  { id: 'nd500', name: 'ND500', stops: 9 },
  { id: 'nd1k', name: 'ND1K', stops: 10 },
  { id: 'nd8k', name: 'ND8K', stops: 13 },
  { id: 'nd64k', name: 'ND64K', stops: 16 },
];

export function findFilter(id: string): FilterDef | undefined {
  return FILTERS.find(f => f.id === id);
}

/** The photographer's saved kit: ND64 (6) + ND1000 (10) = 16 stops. */
export const DEFAULT_KIT: string[] = ['nd64', 'nd1k'];

export const DEFAULT_KIT_STOPS = DEFAULT_KIT.reduce((sum, id) => {
  const f = findFilter(id);
  return sum + (f ? f.stops : 0);
}, 0);
