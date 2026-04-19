// Recherche exhaustive de la meilleure équipe possible parmi team ∪ box.
// Énumère toutes les combinaisons de taille 1..min(|pool|, TEAM_MAX), évalue
// via calcVictoryOdds (box=[] pour éviter la récursion des suggestions), et
// retient le meilleur pct. Tie-break : moins de changements, puis taille max.

import type { BattleKind, GenerationId, Pokemon } from "../types/battle.js";
import type { BestTeam } from "../types/result.js";
import { calcVictoryOdds } from "./odds.js";

const MAX_TEAM_SIZE = 6;

// Générateur itératif des C(n,k) combinaisons (sans duplication, ordre fixé).
function* combinations<T>(arr: T[], k: number): Generator<T[]> {
  const n = arr.length;
  if (k > n || k <= 0) return;
  const idx = Array.from({ length: k }, (_, i) => i);
  while (true) {
    yield idx.map((i) => arr[i] as T);
    let i = k - 1;
    while (i >= 0 && idx[i] === i + n - k) i--;
    if (i < 0) return;
    (idx[i] as number)++;
    for (let j = i + 1; j < k; j++) idx[j] = (idx[j - 1] as number) + 1;
  }
}

// Diff référentiel entre deux équipes. Les instances pokémon viennent toutes
// du pool unique team∪box, donc l'égalité par référence suffit.
function diffTeams(
  current: Pokemon[],
  next: Pokemon[],
): { added: Pokemon[]; removed: Pokemon[] } {
  const nextSet = new Set(next);
  const currentSet = new Set(current);
  return {
    added: next.filter((p) => !currentSet.has(p)),
    removed: current.filter((p) => !nextSet.has(p)),
  };
}

export function findBestTeam(
  team: Pokemon[],
  box: Pokemon[],
  items: string[],
  battle: BattleKind,
  gen: GenerationId,
  round: number,
): BestTeam {
  const currentResult = calcVictoryOdds(team, [], items, battle, gen, round);
  const currentPct = currentResult.pct;
  const pool = [...team, ...box];
  const maxSize = Math.min(pool.length, MAX_TEAM_SIZE);

  let best: BestTeam = {
    team: [...team],
    pct: currentPct,
    gain: 0,
    added: [],
    removed: [],
    changes: 0,
  };

  for (let k = 1; k <= maxSize; k++) {
    for (const combo of combinations(pool, k)) {
      const { pct } = calcVictoryOdds(combo, [], items, battle, gen, round);
      const { added, removed } = diffTeams(team, combo);
      const changes = added.length + removed.length;

      const better =
        pct > best.pct ||
        (pct === best.pct && changes < best.changes) ||
        (pct === best.pct && changes === best.changes && combo.length > best.team.length);

      if (better) {
        best = { team: combo, pct, gain: pct - currentPct, added, removed, changes };
      }
    }
  }

  return best;
}
