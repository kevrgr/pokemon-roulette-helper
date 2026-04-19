#!/usr/bin/env node
// Génère src/data/pokedex.ts à partir des sources du mod zeroxm/pokemon-roulette.
//
// Sources :
//   - national-dex-pokemon.ts : types + power (échelle 1-5 propre au mod)
//   - pokemon-forms.ts        : formes alternatives (Hisui, Alola, Galar, Mega, etc.)
//                               avec leur propre id (= id PokeAPI, sprites OK)
//   - i18n/fr.json            : noms FR (clé = slug anglais)
//
// Dans le mod, la roulette principale sort un pokémon (avec son power), puis une
// seconde roulette choisit la forme. On linéarise : chaque forme devient une
// entrée distincte du pokédex, héritant du power de sa forme de base.
//
// Lancer manuellement quand le mod évolue : `npm run generate:pokedex`.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const MOD_BASE = "https://raw.githubusercontent.com/zeroxm/pokemon-roulette/main";
const DEX_URL = `${MOD_BASE}/src/app/services/pokemon-service/national-dex-pokemon.ts`;
const FORMS_URL = `${MOD_BASE}/src/app/services/pokemon-forms-service/pokemon-forms.ts`;
const FR_URL = `${MOD_BASE}/src/assets/i18n/fr.json`;

const OUT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src/data/pokedex.ts");

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${url}`);
  return res.text();
}

function parseNationalDex(src) {
  // Chaque entrée : un objet littéral avec text/pokemonId/type1/type2/power/weight.
  const re =
    /\{\s*text:\s*"pokemon\.([^"]+)"[\s\S]*?pokemonId:\s*(\d+)[\s\S]*?type1:\s*"([^"]+)"[\s\S]*?type2:\s*(?:null|"([^"]*)")[\s\S]*?power:\s*(\d+)[\s\S]*?weight:\s*\d+\s*\}/g;
  const entries = [];
  let m;
  while ((m = re.exec(src))) {
    entries.push({
      slug: m[1],
      id: Number(m[2]),
      type1: m[3],
      type2: m[4] || null,
      power: Number(m[5]),
    });
  }
  return entries;
}

// Parse `pokemon-forms.ts` : `Record<baseId, PokemonForm[]>`. On récupère chaque
// forme en gardant trace du baseId parent (nécessaire pour hériter le power).
function parsePokemonForms(src) {
  const entries = [];
  const blockRe = /^\s*(\d+):\s*\[([\s\S]*?)^\s*\],?\s*$/gm;
  const itemRe =
    /\{\s*pokemonId:\s*(\d+)[\s\S]*?text:\s*"pokemon\.([^"]+)"[\s\S]*?type1:\s*"([^"]+)"[\s\S]*?type2:\s*(?:null|"([^"]*)")[\s\S]*?weight:\s*\d+\s*\}/g;
  let bm;
  while ((bm = blockRe.exec(src))) {
    const baseId = Number(bm[1]);
    itemRe.lastIndex = 0;
    let im;
    while ((im = itemRe.exec(bm[2]))) {
      entries.push({
        baseId,
        id: Number(im[1]),
        slug: im[2],
        type1: im[3],
        type2: im[4] || null,
      });
    }
  }
  return entries;
}

function tsLiteral(value) {
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  return JSON.stringify(value);
}

async function main() {
  console.log("↓ national-dex-pokemon.ts");
  const dexSrc = await fetchText(DEX_URL);
  console.log("↓ pokemon-forms.ts");
  const formsSrc = await fetchText(FORMS_URL);
  console.log("↓ fr.json");
  const frJson = JSON.parse(await fetchText(FR_URL));

  const frNames = frJson.pokemon;
  if (!frNames || typeof frNames !== "object") {
    throw new Error('fr.json ne contient pas de clé "pokemon"');
  }

  const dexEntries = parseNationalDex(dexSrc);
  if (dexEntries.length === 0) throw new Error("Aucun pokémon parsé (regex cassée ?)");

  const formEntries = parsePokemonForms(formsSrc);
  if (formEntries.length === 0) throw new Error("Aucune forme parsée (regex cassée ?)");

  // Table `power` indexée par id de base, pour hériter le power sur les formes.
  const powerByBaseId = new Map(dexEntries.map((e) => [e.id, e.power]));

  // Pour chaque entrée de base, on garde la liste des ids déjà connus afin
  // d'éviter les doublons quand une forme reprend l'id du pokémon de base.
  const knownIds = new Set(dexEntries.map((e) => e.id));

  const missing = [];
  const fromDex = dexEntries.map((e) => ({
    id: e.id,
    slug: e.slug,
    type1: e.type1,
    type2: e.type2,
    power: e.power,
  }));

  const fromForms = formEntries
    .filter((f) => !knownIds.has(f.id))
    .map((f) => ({
      id: f.id,
      slug: f.slug,
      type1: f.type1,
      type2: f.type2,
      power: powerByBaseId.get(f.baseId) ?? 1,
    }));

  const merged = [...fromDex, ...fromForms]
    .map((e) => {
      const nameFr = frNames[e.slug];
      if (!nameFr) {
        missing.push(e.slug);
        return null;
      }
      return { id: e.id, nameFr, type1: e.type1, type2: e.type2, power: e.power };
    })
    .filter((e) => e !== null)
    .sort((a, b) => a.id - b.id);

  if (missing.length > 0) {
    console.warn(`⚠ ${missing.length} slug(s) sans traduction FR, ignorés :`, missing.slice(0, 10));
  }
  console.log(`  · ${fromDex.length} entrées pokédex national + ${fromForms.length} formes alternatives`);

  const header = `// Pokédex complet (Gen 1-9) généré depuis zeroxm/pokemon-roulette.
// Ne pas éditer à la main — régénérer via \`npm run generate:pokedex\`.
// Source : ${DEX_URL}
//          ${FR_URL}

import type { PokedexEntry } from "../types/battle.js";

export const POKEDEX: readonly PokedexEntry[] = [
`;

  const body = merged
    .map((e) => {
      const parts = [
        `id: ${e.id}`,
        `nameFr: ${tsLiteral(e.nameFr)}`,
        `type1: ${tsLiteral(e.type1)}`,
      ];
      if (e.type2) parts.push(`type2: ${tsLiteral(e.type2)}`);
      parts.push(`power: ${e.power}`);
      return `  { ${parts.join(", ")} },`;
    })
    .join("\n");

  const footer = "\n] as const;\n";

  await writeFile(OUT_PATH, header + body + footer, "utf8");
  console.log(`✓ ${merged.length} entrées écrites dans ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("✗ Échec génération pokédex :", err.message);
  process.exit(1);
});
