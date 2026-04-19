// Recherche dans le pokédex par nom FR (insensible à la casse et aux accents).

import { POKEDEX } from "../data/pokedex.js";
import type { PokedexEntry } from "../types/battle.js";

export const MIN_QUERY_LENGTH = 3;
export const MAX_RESULTS = 10;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// Pré-calcul des formes normalisées pour éviter de refaire le travail à chaque frappe.
const INDEX: { entry: PokedexEntry; normalized: string }[] = POKEDEX.map((entry) => ({
  entry,
  normalized: normalize(entry.nameFr),
}));

export function searchPokedex(query: string): PokedexEntry[] {
  const q = normalize(query.trim());
  if (q.length < MIN_QUERY_LENGTH) return [];
  return INDEX.filter(({ normalized }) => normalized.startsWith(q))
    .slice(0, MAX_RESULTS)
    .map(({ entry }) => entry);
}

export function findExactByName(name: string): PokedexEntry | null {
  const n = normalize(name.trim());
  const match = INDEX.find(({ normalized }) => normalized === n);
  return match ? match.entry : null;
}
