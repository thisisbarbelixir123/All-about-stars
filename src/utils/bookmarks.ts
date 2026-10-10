// Star Bookmarking and Custom Observation List Management Utility
// Stores user favorites, custom observing targets, and observational notes in localStorage

export interface ObservationList {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  starIds: string[];
}

export interface UserAstronomyData {
  bookmarkedStarIds: string[];
  lists: ObservationList[];
  notes: Record<string, string>; // starId -> personal observation note
}

const STORAGE_KEY = 'cosmic_user_astronomy_data';

const DEFAULT_LISTS: ObservationList[] = [
  {
    id: 'backyard-viewing',
    name: "Tonight's Backyard Targets",
    description: 'Bright visible stars suitable for naked eye and small telescopes.',
    createdAt: Date.now(),
    starIds: ['sun', 'sirius-a', 'vega', 'betelgeuse', 'polaris'],
  },
  {
    id: 'supernova-candidates',
    name: 'Supernova Watchlist',
    description: 'Massive evolved supergiants nearing core collapse.',
    createdAt: Date.now(),
    starIds: ['betelgeuse', 'antares', 'eta-carinae', 'rho-cassiopeiae'],
  },
  {
    id: 'compact-remnants',
    name: 'Exotic Relativistic Remnants',
    description: 'White dwarfs, pulsars, magnetars, and black holes.',
    createdAt: Date.now(),
    starIds: ['sirius-b', 'crab-pulsar', 'sgr-1806-20', 'cygnus-x-1', 'sagittarius-a-star'],
  },
];

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn(e);
    }
  });
}

export function getUserAstronomyData(): UserAstronomyData {
  if (typeof window === 'undefined') {
    return { bookmarkedStarIds: ['sirius-a', 'betelgeuse', 'proxima-centauri'], lists: DEFAULT_LISTS, notes: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        bookmarkedStarIds: Array.isArray(parsed.bookmarkedStarIds) ? parsed.bookmarkedStarIds : ['sirius-a', 'betelgeuse', 'proxima-centauri'],
        lists: Array.isArray(parsed.lists) && parsed.lists.length > 0 ? parsed.lists : DEFAULT_LISTS,
        notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {},
      };
    }
  } catch (e) {
    console.warn('Failed to parse astronomy user data:', e);
  }
  return {
    bookmarkedStarIds: ['sirius-a', 'betelgeuse', 'proxima-centauri', 'vega'],
    lists: DEFAULT_LISTS,
    notes: {},
  };
}

export function saveUserAstronomyData(data: UserAstronomyData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save astronomy user data:', e);
  }
  notify();
}

export function isStarBookmarked(starId: string): boolean {
  const data = getUserAstronomyData();
  return data.bookmarkedStarIds.includes(starId);
}

export function toggleStarBookmark(starId: string): boolean {
  const data = getUserAstronomyData();
  const exists = data.bookmarkedStarIds.includes(starId);
  if (exists) {
    data.bookmarkedStarIds = data.bookmarkedStarIds.filter((id) => id !== starId);
  } else {
    data.bookmarkedStarIds.push(starId);
  }
  saveUserAstronomyData(data);
  return !exists;
}

export function setStarNote(starId: string, note: string): void {
  const data = getUserAstronomyData();
  if (note.trim().length === 0) {
    delete data.notes[starId];
  } else {
    data.notes[starId] = note.trim();
  }
  saveUserAstronomyData(data);
}

export function getStarNote(starId: string): string {
  const data = getUserAstronomyData();
  return data.notes[starId] || '';
}

export function createObservationList(name: string, description: string = ''): ObservationList {
  const data = getUserAstronomyData();
  const newList: ObservationList = {
    id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || 'New Observation List',
    description: description.trim(),
    createdAt: Date.now(),
    starIds: [],
  };
  data.lists.push(newList);
  saveUserAstronomyData(data);
  return newList;
}

export function deleteObservationList(listId: string): void {
  const data = getUserAstronomyData();
  data.lists = data.lists.filter((l) => l.id !== listId);
  saveUserAstronomyData(data);
}

export function addStarToObservationList(listId: string, starId: string): void {
  const data = getUserAstronomyData();
  const target = data.lists.find((l) => l.id === listId);
  if (target && !target.starIds.includes(starId)) {
    target.starIds.push(starId);
    saveUserAstronomyData(data);
  }
}

export function removeStarFromObservationList(listId: string, starId: string): void {
  const data = getUserAstronomyData();
  const target = data.lists.find((l) => l.id === listId);
  if (target) {
    target.starIds = target.starIds.filter((id) => id !== starId);
    saveUserAstronomyData(data);
  }
}

export function exportAstronomyDataJSON(): string {
  const data = getUserAstronomyData();
  return JSON.stringify(data, null, 2);
}

export function importAstronomyDataJSON(rawJson: string): boolean {
  try {
    const parsed = JSON.parse(rawJson);
    if (parsed && Array.isArray(parsed.bookmarkedStarIds) && Array.isArray(parsed.lists)) {
      saveUserAstronomyData({
        bookmarkedStarIds: parsed.bookmarkedStarIds,
        lists: parsed.lists,
        notes: typeof parsed.notes === 'object' && parsed.notes !== null ? parsed.notes : {},
      });
      return true;
    }
  } catch (e) {
    console.warn('Import failed:', e);
  }
  return false;
}

export function subscribeAstronomyData(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
