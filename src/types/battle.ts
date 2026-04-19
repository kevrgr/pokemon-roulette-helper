// Types de domaine pour la logique de combat.

export const POKEMON_TYPES = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

// Marqueur "various" présent dans certaines entrées de champions ou d'élite.
// Filtré avant d'entrer dans la logique d'affrontement.
export type DisplayType = PokemonType | "various";

export type BattleKind = "gym" | "rival" | "elite" | "champion";

export type GenerationId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Pokemon {
  type1?: PokemonType;
  type2?: PokemonType;
  power?: number;
}

export interface TypeMatchup {
  strong_against: PokemonType[];
}

export interface Item {
  display_name: string;
  battle_effect: "retry" | "power_boost" | "none";
  retry_count?: number;
  sprite: string;
}

// Les entrées composites (ex. Cilan/Chili/Cress, Drayden/Iris) utilisent un tableau
// d'URLs, une par dresseur possible ; les entrées simples utilisent une string.
export interface Leader {
  name: string;
  nameFr: string;
  types: DisplayType[];
  random?: boolean;
  sprite: string | string[];
}

export interface EliteMember {
  name: string;
  nameFr: string;
  types: DisplayType[];
  random?: boolean;
  sprite: string | string[];
}

export interface Champion {
  name: string;
  nameFr: string;
  types: DisplayType[];
  sprite: string | string[];
}

export interface PokedexEntry {
  id: number;
  nameFr: string;
  type1: PokemonType;
  type2?: PokemonType;
  power: number;
}

export interface BattleRules {
  base_yes_slots: number;
  base_no_slots: Record<BattleKind, number>;
  no_per_round: number;
  type_advantage: {
    overwhelming: { yes_bonus: number };
    advantage: { yes_bonus: number };
    disadvantage: { no_bonus: number };
    severe_disadvantage: { no_bonus: number };
  };
}
