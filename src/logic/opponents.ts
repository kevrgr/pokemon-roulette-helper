// Détermination des types adverses pour un round donné.

import { CHAMPIONS } from "../data/champions.js";
import { ELITE_FOUR } from "../data/elite-four.js";
import { GYM_LEADERS } from "../data/gym-leaders.js";
import type { BattleKind, DisplayType, GenerationId, PokemonType } from "../types/battle.js";

function filterPlayable(types: DisplayType[]): PokemonType[] {
  return types.filter((t): t is PokemonType => t !== "various");
}

export function getOpponentTypes(
  battle: BattleKind,
  gen: GenerationId,
  roundIdx: number,
): PokemonType[] {
  if (battle === "gym") {
    const leaders = GYM_LEADERS[gen] ?? [];
    if (roundIdx >= 0 && roundIdx < leaders.length) {
      const leader = leaders[roundIdx];
      if (leader) return filterPlayable(leader.types);
    }
  } else if (battle === "elite") {
    const members = ELITE_FOUR[gen] ?? [];
    const idx = ((roundIdx % 4) + 4) % 4;
    if (idx >= 0 && idx < members.length) {
      const member = members[idx];
      if (member) return filterPlayable(member.types);
    }
  } else if (battle === "champion") {
    const champ = CHAMPIONS[gen];
    if (champ) return filterPlayable(champ.types);
  }
  return [];
}
