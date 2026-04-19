import { EVOLUTION_CHAIN } from "../data/evolution-chain.js";
import { POKEDEX } from "../data/pokedex.js";
import type { PokedexEntry } from "../types/battle.js";

const POKEDEX_BY_ID = new Map<number, PokedexEntry>(POKEDEX.map((e) => [e.id, e]));

export function getEvolutions(pokemonId: number): PokedexEntry[] {
  const ids = EVOLUTION_CHAIN[pokemonId] ?? [];
  return ids.map((id) => POKEDEX_BY_ID.get(id)).filter((e): e is PokedexEntry => e !== undefined);
}
