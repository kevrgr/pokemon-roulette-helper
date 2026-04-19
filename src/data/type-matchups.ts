// Table des forces de type.
// Seul `strong_against` est exposé : la faiblesse de A face à B se déduit
// de B.strong_against.includes(A).

import type { PokemonType, TypeMatchup } from "../types/battle.js";

export const TYPE_MATCHUPS: Record<PokemonType, TypeMatchup> = {
  bug: { strong_against: ["dark", "grass", "psychic"] },
  dark: { strong_against: ["ghost", "psychic"] },
  dragon: { strong_against: ["dragon"] },
  electric: { strong_against: ["flying", "water"] },
  fairy: { strong_against: ["dark", "dragon", "fighting"] },
  fighting: { strong_against: ["dark", "ice", "normal", "rock", "steel"] },
  fire: { strong_against: ["bug", "grass", "ice", "steel"] },
  flying: { strong_against: ["bug", "fighting", "grass"] },
  ghost: { strong_against: ["ghost", "psychic"] },
  grass: { strong_against: ["ground", "rock", "water"] },
  ground: { strong_against: ["electric", "fire", "poison", "rock", "steel"] },
  ice: { strong_against: ["dragon", "flying", "grass", "ground"] },
  normal: { strong_against: [] },
  poison: { strong_against: ["fairy", "grass"] },
  psychic: { strong_against: ["fighting", "poison"] },
  rock: { strong_against: ["bug", "fire", "flying", "ice"] },
  steel: { strong_against: ["fairy", "ice", "rock"] },
  water: { strong_against: ["fire", "ground", "rock"] },
};
