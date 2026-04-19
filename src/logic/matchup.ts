// Calcul de matchup d'un pokémon contre les types adverses.

import { TYPE_MATCHUPS } from "../data/type-matchups.js";
import type { Pokemon, PokemonType } from "../types/battle.js";
import type { MatchupResult } from "../types/result.js";

export function calcMatchup(pokemon: Pokemon, oppTypes: PokemonType[]): MatchupResult {
  if (oppTypes.length === 0) {
    return { strong: false, weak: false };
  }
  const ptypes: PokemonType[] = [];
  if (pokemon.type1) ptypes.push(pokemon.type1);
  if (pokemon.type2) ptypes.push(pokemon.type2);

  let strong = false;
  let weak = false;
  for (const pt of ptypes) {
    const ptStrong = TYPE_MATCHUPS[pt]?.strong_against ?? [];
    for (const opp of oppTypes) {
      if (ptStrong.includes(opp)) strong = true;
      const oppStrong = TYPE_MATCHUPS[opp]?.strong_against ?? [];
      if (oppStrong.includes(pt)) weak = true;
    }
  }
  return { strong, weak };
}
