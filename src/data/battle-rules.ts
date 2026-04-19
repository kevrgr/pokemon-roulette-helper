// Règles de probabilité.
// Source : zeroxm/pokemon-roulette (base-battle-roulette + composants gym/elite/champion).

import type { BattleRules } from "../types/battle.js";

export const BATTLE_RULES: BattleRules = {
  base_yes_slots: 1,
  base_no_slots: {
    gym: 1,
    rival: 1,
    elite: 2,
    champion: 3,
  },
  no_per_round: 1,
  type_advantage: {
    overwhelming: { yes_bonus: 3 },
    advantage: { yes_bonus: 2 },
    disadvantage: { no_bonus: 1 },
    severe_disadvantage: { no_bonus: 2 },
  },
};
