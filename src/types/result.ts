// Types de sortie de la logique de calcul.

import type { Pokemon, PokemonType } from "./battle.js";

export type AdvantageLabel =
  | "overwhelming"
  | "advantage"
  | "disadvantage"
  | "severe_disadvantage"
  | null;

export interface MatchupResult {
  strong: boolean;
  weak: boolean;
}

export interface SwapSuggestion {
  remove: Pokemon;
  add: Pokemon;
  new_pct: number;
  gain: number;
}

export interface OddsResult {
  yes: number;
  no: number;
  pct: number;
  advantage_label: AdvantageLabel;
  strong_count: number;
  weak_count: number;
  opp_types: PokemonType[];
  retry_bonus: number;
  swap_suggestions: SwapSuggestion[];
}

// Résultat de la recherche exhaustive de la meilleure équipe possible parmi
// team ∪ box (toutes tailles de 1 à TEAM_MAX confondues). `added` / `removed`
// sont les différences par rapport à l'équipe courante, comparées par référence.
export interface BestTeam {
  team: Pokemon[];
  pct: number;
  gain: number;
  added: Pokemon[];
  removed: Pokemon[];
  changes: number;
}
