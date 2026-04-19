// Tests de parité contre la fixture historique.
// Source de vérité : tests/fixtures/parity.json (snapshot figé, hérité de la version
// initiale auditée conforme au mod source). Tout écart entre TS et JSON = régression.

import { describe, expect, it } from "vitest";
import fixtures from "./fixtures/parity.json" with { type: "json" };

import { calcVictoryOdds } from "../src/logic/odds.js";
import { getOpponentTypes } from "../src/logic/opponents.js";
import type { BattleKind, GenerationId, Pokemon } from "../src/types/battle.js";

interface FixtureCase {
  input: {
    name: string;
    team: Pokemon[];
    box: Pokemon[];
    items: string[];
    battle: BattleKind;
    gen: GenerationId;
    round: number;
  };
  expected: ReturnType<typeof calcVictoryOdds>;
  opp_types: string[];
}

const cases = fixtures as FixtureCase[];

describe("Régression calcVictoryOdds", () => {
  for (const fixture of cases) {
    it(`cas « ${fixture.input.name} » : sortie identique à la référence`, () => {
      const { team, box, items, battle, gen, round } = fixture.input;
      const result = calcVictoryOdds(team, box, items, battle, gen, round);
      expect(result).toEqual(fixture.expected);
    });
  }
});

describe("Régression getOpponentTypes", () => {
  for (const fixture of cases) {
    it(`cas « ${fixture.input.name} » : types adverses identiques`, () => {
      const { battle, gen, round } = fixture.input;
      const types = getOpponentTypes(battle, gen, round);
      expect(types).toEqual(fixture.opp_types);
    });
  }
});
