// Items de combat. Seuls les champs lus par la logique ou l'UI sont conservés.
// URLs sprites reprises du mod source (zeroxm/pokemon-roulette,
// `src/app/services/item-sprite-service/item-sprite.service.ts`).

import type { Item } from "../types/battle.js";

const POKEAPI = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items";

export const ITEMS: Record<string, Item> = {
  potion: {
    display_name: "Potion",
    battle_effect: "retry",
    retry_count: 1,
    sprite: `${POKEAPI}/potion.png`,
  },
  "super-potion": {
    display_name: "Super Potion",
    battle_effect: "retry",
    retry_count: 2,
    sprite: `${POKEAPI}/super-potion.png`,
  },
  "hyper-potion": {
    display_name: "Hyper Potion",
    battle_effect: "retry",
    retry_count: 3,
    sprite: `${POKEAPI}/hyper-potion.png`,
  },
  "x-attack": {
    display_name: "X-Attack",
    battle_effect: "power_boost",
    sprite: `${POKEAPI}/x-attack.png`,
  },
  "rare-candy": {
    display_name: "Rare Candy",
    battle_effect: "none",
    sprite: `${POKEAPI}/rare-candy.png`,
  },
  "running-shoes": {
    display_name: "Running Shoes",
    battle_effect: "none",
    // Pas d'entrée PokeAPI : le mod utilise Bulbagarden pour ce sprite.
    sprite: "https://archives.bulbagarden.net/media/upload/4/42/Bag_Running_Shoes_Sprite.png",
  },
  "exp-share": {
    display_name: "Exp Share",
    battle_effect: "none",
    sprite: `${POKEAPI}/exp-share.png`,
  },
};
