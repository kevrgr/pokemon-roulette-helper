// Tests sur la recherche du pokédex : seuil à 3 lettres, insensibilité accent/casse,
// intégrité des données générées pour quelques pokémons témoins.

import { describe, expect, it } from "vitest";
import { POKEDEX } from "../src/data/pokedex.js";
import { findExactByName, searchPokedex } from "../src/ui/pokedex-search.js";

describe("searchPokedex — seuil minimal", () => {
  it("retourne [] pour moins de 3 caractères", () => {
    expect(searchPokedex("")).toEqual([]);
    expect(searchPokedex("dr")).toEqual([]);
  });

  it("retourne des résultats à partir de 3 caractères", () => {
    const res = searchPokedex("dra");
    expect(res.length).toBeGreaterThan(0);
    expect(res.some((p) => p.nameFr === "Dracaufeu")).toBe(true);
  });
});

describe("searchPokedex — normalisation", () => {
  it("ignore la casse", () => {
    expect(searchPokedex("DRA").some((p) => p.nameFr === "Dracaufeu")).toBe(true);
  });

  it("ignore les accents (ex. Salamèche)", () => {
    expect(searchPokedex("sala").some((p) => p.nameFr === "Salamèche")).toBe(true);
  });

  it("filtre en startsWith, pas en includes", () => {
    const res = searchPokedex("zar");
    expect(res.every((p) => p.nameFr.toLowerCase().startsWith("zar"))).toBe(true);
  });
});

describe("POKEDEX — intégrité des données générées", () => {
  it("contient les 1025 entrées du pokédex national + les formes alternatives", () => {
    // 1025 pokémons de base (Gen 1-9) + formes régionales/Mega/etc. du mod.
    const baseCount = POKEDEX.filter((p) => p.id <= 1025).length;
    expect(baseCount).toBe(1025);
    expect(POKEDEX.length).toBeGreaterThan(1025);
  });

  it("Bulbizarre : grass/poison, power 1", () => {
    const p = findExactByName("Bulbizarre");
    expect(p).toEqual({ id: 1, nameFr: "Bulbizarre", type1: "grass", type2: "poison", power: 1 });
  });

  it("Dracaufeu : fire/flying, power 3", () => {
    const p = findExactByName("Dracaufeu");
    expect(p).toEqual({ id: 6, nameFr: "Dracaufeu", type1: "fire", type2: "flying", power: 3 });
  });

  it("Mewtwo : psychic mono-type, power 5", () => {
    const p = findExactByName("Mewtwo");
    expect(p).toEqual({ id: 150, nameFr: "Mewtwo", type1: "psychic", power: 5 });
  });

  it("Typhlosion (Hisui) : fire/ghost, power hérité de la forme de base", () => {
    const p = findExactByName("Typhlosion (Hisui)");
    expect(p).toEqual({
      id: 10233,
      nameFr: "Typhlosion (Hisui)",
      type1: "fire",
      type2: "ghost",
      power: 3,
    });
  });
});
