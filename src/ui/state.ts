// État mutable de l'UI : équipe, boîte, comptage d'items.
// L'UI nomme aussi les pokémons pour l'affichage ; la logique pure ignore le nom.

import type { Pokemon, PokemonType } from "../types/battle.js";

export interface UIPokemon extends Pokemon {
  name: string;
  type1: PokemonType;
  // Optionnel : id national du pokédex, propagé quand le pokémon est ajouté
  // via l'autocomplétion. Permet d'afficher un sprite ; absent si l'utilisateur
  // a saisi un nom libre.
  id?: number;
}

export const team: UIPokemon[] = [];
export const box: UIPokemon[] = [];

// Quantité détenue par item (clé = slug ITEMS). 0 ou absent = non détenu.
// La logique (calcVictoryOdds) reçoit un tableau à doublons ; on l'expanse via
// getItemsHeld() pour préserver le contrat existant et la fixture de parité.
export const itemCounts: Record<string, number> = {};

export function getItemsHeld(): string[] {
  const out: string[] = [];
  for (const [key, count] of Object.entries(itemCounts)) {
    for (let i = 0; i < count; i++) out.push(key);
  }
  return out;
}

export const TEAM_MAX = 6;
