// Calcul des slots OUI/NON et probabilité de victoire.
// Ordre critique : power → X-Attack → avantage de type → base NON → potions → swaps.

import { BATTLE_RULES } from "../data/battle-rules.js";
import { ITEMS } from "../data/items.js";
import type { BattleKind, GenerationId, Pokemon } from "../types/battle.js";
import type { AdvantageLabel, OddsResult, SwapSuggestion } from "../types/result.js";
import { calcMatchup } from "./matchup.js";
import { getOpponentTypes } from "./opponents.js";
import { roundPy } from "./rounding.js";

export function calcVictoryOdds(
  team: Pokemon[],
  box: Pokemon[],
  itemsHeld: string[],
  battle: BattleKind,
  gen: GenerationId,
  roundIdx: number,
): OddsResult {
  const rules = BATTLE_RULES;
  const oppTypes = getOpponentTypes(battle, gen, roundIdx);

  let yes = rules.base_yes_slots;
  let no = 0;

  // Power de chaque pokémon (défaut 1).
  for (const pk of team) {
    yes += Math.trunc(pk.power ?? 1);
  }

  // X-Attack : bonus = floor(moyenne power) * nb x-attacks.
  const xCount = itemsHeld.filter((i) => i === "x-attack").length;
  if (xCount > 0 && team.length > 0) {
    const sumPower = team.reduce((s, p) => s + Math.trunc(p.power ?? 1), 0);
    const meanPower = sumPower / team.length;
    yes += Math.floor(meanPower * xCount);
  }

  // Avantage/désavantage de types (exclusif via if/else if).
  const strongCount = team.filter((pk) => calcMatchup(pk, oppTypes).strong).length;
  const weakCount = team.filter((pk) => calcMatchup(pk, oppTypes).weak).length;

  const ta = rules.type_advantage;
  let advantageLabel: AdvantageLabel;
  if (strongCount >= 3) {
    yes += ta.overwhelming.yes_bonus;
    advantageLabel = "overwhelming";
  } else if (strongCount >= 1) {
    yes += ta.advantage.yes_bonus;
    advantageLabel = "advantage";
  } else if (weakCount > 3) {
    no += ta.severe_disadvantage.no_bonus;
    advantageLabel = "severe_disadvantage";
  } else if (weakCount >= 1) {
    no += ta.disadvantage.no_bonus;
    advantageLabel = "disadvantage";
  } else {
    advantageLabel = null;
  }

  // Base NON + difficulté croissante par round.
  const baseNo = rules.base_no_slots[battle] ?? 1;
  no += baseNo + roundIdx * rules.no_per_round;

  const total = yes + no;
  const pct = total ? roundPy((yes / total) * 100) : 0;

  // Bonus tentatives (potions) : max non cumulatif.
  let retryBonus = 0;
  for (const itemName of itemsHeld) {
    const itemData = ITEMS[itemName];
    if (itemData?.battle_effect === "retry") {
      retryBonus = Math.max(retryBonus, itemData.retry_count ?? 0);
    }
  }

  // Suggestions de swap : appel récursif avec box=[] (base case).
  const swapSuggestions: SwapSuggestion[] = [];
  for (let i = 0; i < team.length; i++) {
    for (const boxPk of box) {
      const newTeam = [...team.slice(0, i), boxPk, ...team.slice(i + 1)];
      const alt = calcVictoryOdds(newTeam, [], itemsHeld, battle, gen, roundIdx);
      const diff = alt.pct - pct;
      if (diff > 0) {
        const teamPk = team[i];
        if (teamPk) {
          swapSuggestions.push({
            remove: teamPk,
            add: boxPk,
            new_pct: alt.pct,
            gain: diff,
          });
        }
      }
    }
  }

  swapSuggestions.sort((a, b) => b.gain - a.gain);

  return {
    yes,
    no,
    pct,
    advantage_label: advantageLabel,
    strong_count: strongCount,
    weak_count: weakCount,
    opp_types: oppTypes,
    retry_bonus: retryBonus,
    swap_suggestions: swapSuggestions.slice(0, 5),
  };
}
