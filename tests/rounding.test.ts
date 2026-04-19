// Tests unitaires sur roundPy : banker's rounding (arrondi au pair).
// Math.round natif JS arrondit .5 vers le haut ; nous voulons l'arrondi au pair.

import { describe, expect, it } from "vitest";
import { roundPy } from "../src/logic/rounding.js";

describe("roundPy — banker's rounding", () => {
  it("arrondit 0.5 → 0 (pair le plus proche)", () => {
    expect(roundPy(0.5)).toBe(0);
  });

  it("arrondit 1.5 → 2 (pair le plus proche)", () => {
    expect(roundPy(1.5)).toBe(2);
  });

  it("arrondit 2.5 → 2 (pair le plus proche)", () => {
    expect(roundPy(2.5)).toBe(2);
  });

  it("arrondit 3.5 → 4 (pair le plus proche)", () => {
    expect(roundPy(3.5)).toBe(4);
  });

  it("arrondit 12.5 → 12 (cas typique d'un pourcentage)", () => {
    expect(roundPy(12.5)).toBe(12);
  });

  it("arrondit 0.4 → 0 (en dessous de .5)", () => {
    expect(roundPy(0.4)).toBe(0);
  });

  it("arrondit 0.6 → 1 (au dessus de .5)", () => {
    expect(roundPy(0.6)).toBe(1);
  });

  it("arrondit un entier à lui-même", () => {
    expect(roundPy(7)).toBe(7);
  });
});
