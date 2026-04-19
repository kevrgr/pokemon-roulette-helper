// Couleurs officielles par type Pokémon (palette de référence du mod).

import type { PokemonType } from "../types/battle.js";

export const TYPE_COLORS: Record<PokemonType, string> = {
  bug: "#97C459",
  dark: "#444441",
  dragon: "#7F77DD",
  electric: "#EF9F27",
  fairy: "#ED93B1",
  fighting: "#D85A30",
  fire: "#E24B4A",
  flying: "#85B7EB",
  ghost: "#534AB7",
  grass: "#639922",
  ground: "#BA7517",
  ice: "#5DCAA5",
  normal: "#B4B2A9",
  poison: "#D4537E",
  psychic: "#D85A30",
  rock: "#888780",
  steel: "#5F5E5A",
  water: "#378ADD",
};

// ID PokeAPI par type — utilisé pour récupérer les sprites "plaquette" avec
// le nom écrit dessus, hébergés dans PokeAPI/sprites.
// Source : https://pokeapi.co/api/v2/type/ (champ `id`).
export const TYPE_POKEAPI_ID: Record<PokemonType, number> = {
  normal: 1,
  fighting: 2,
  flying: 3,
  poison: 4,
  ground: 5,
  rock: 6,
  bug: 7,
  ghost: 8,
  steel: 9,
  fire: 10,
  water: 11,
  grass: 12,
  electric: 13,
  psychic: 14,
  ice: 15,
  dragon: 16,
  dark: 17,
  fairy: 18,
};

export const TYPE_TEXT: Record<PokemonType, string> = {
  bug: "#27500A",
  dark: "#D3D1C7",
  dragon: "#EEEDFE",
  electric: "#412402",
  fairy: "#4B1528",
  fighting: "#FAECE7",
  fire: "#FCEBEB",
  flying: "#042C53",
  ghost: "#EEEDFE",
  grass: "#173404",
  ground: "#412402",
  ice: "#04342C",
  normal: "#2C2C2A",
  poison: "#4B1528",
  psychic: "#4A1B0C",
  rock: "#F1EFE8",
  steel: "#F1EFE8",
  water: "#042C53",
};
