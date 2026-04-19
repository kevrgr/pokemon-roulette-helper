// Rendu HTML des sous-parties de l'UI : opponent, listes, résultat, swaps.

import { CHAMPIONS } from "../data/champions.js";
import { ELITE_FOUR } from "../data/elite-four.js";
import { GENERATIONS } from "../data/generations.js";
import { GYM_LEADERS } from "../data/gym-leaders.js";
import { ITEMS } from "../data/items.js";
import { findBestTeam } from "../logic/best-team.js";
import { calcVictoryOdds } from "../logic/odds.js";
import { POKEMON_TYPES } from "../types/battle.js";
import type {
  BattleKind,
  Champion,
  EliteMember,
  GenerationId,
  Leader,
  PokemonType,
} from "../types/battle.js";
import { byId, escapeHtml } from "./dom.js";
import { box, getItemsHeld, itemCounts, team, TEAM_MAX, type UIPokemon } from "./state.js";
import { TYPE_COLORS, TYPE_POKEAPI_ID, TYPE_TEXT } from "./type-colors.js";

// Libellés du menu déroulant "Round" par type de combat.
// Pour `gym`/`elite`, on utilise directement le nom FR du leader/membre :
// aucun préfixe n'est donc nécessaire.
const ROUND_FALLBACK_LABEL: Record<BattleKind, string> = {
  gym: "Arène",
  elite: "Conseil 4",
  champion: "Champion",
  rival: "Combat",
};

function isPokemonType(value: string): value is PokemonType {
  return (POKEMON_TYPES as readonly string[]).includes(value);
}

// Sprite officiel PokeAPI par id national. Miniatures ~1-2 KB chacune.
export function pokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function spriteImg(id: number | undefined, alt: string): string {
  if (!id) return '<span class="poke-sprite poke-sprite-empty" aria-hidden="true"></span>';
  return `<img class="poke-sprite" src="${pokemonSpriteUrl(id)}" alt="${escapeHtml(alt)}" loading="lazy" width="40" height="40">`;
}

// Sprite "plaquette" PokeAPI (style Scarlet/Violet) pour le type `t`.
// En cas d'échec de chargement, on rebascule via `onerror` vers le tag texte
// coloré historique (couleurs conservées dans `TYPE_COLORS` / `TYPE_TEXT`).
// `t` vient de `POKEMON_TYPES` (identifiants contrôlés), pas besoin d'escape.
export function typeTag(t: string | null | undefined): string {
  if (!t || !isPokemonType(t)) return "";
  const bg = TYPE_COLORS[t];
  const fg = TYPE_TEXT[t];
  const id = TYPE_POKEAPI_ID[t];
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${id}.png`;
  const fallback = `<span class=&quot;type-tag&quot; style=&quot;background:${bg};color:${fg}&quot;>${t}</span>`;
  return `<img class="type-sprite" src="${spriteUrl}" alt="${t}" loading="lazy" onerror="this.outerHTML='${fallback}'">`;
}

// Normalise un champ `sprite` qui peut être string (entrée simple) ou string[]
// (leader composite type `Cilan / Chili / Cress`).
function spriteUrls(sprite: string | string[] | undefined): string[] {
  if (!sprite) return [];
  return Array.isArray(sprite) ? sprite : [sprite];
}

function opponentSpriteImgs(sprite: string | string[] | undefined, alt: string): string {
  const urls = spriteUrls(sprite);
  if (urls.length === 0) return "";
  return urls
    .map(
      (url) =>
        `<img class="opp-sprite" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy">`,
    )
    .join("");
}

function getOpponentObject(
  battle: BattleKind,
  gen: GenerationId,
  roundIdx: number,
): Leader | EliteMember | Champion | null {
  if (battle === "gym") {
    const leaders = GYM_LEADERS[gen] ?? [];
    return leaders[roundIdx] ?? null;
  }
  if (battle === "elite") {
    const members = ELITE_FOUR[gen] ?? [];
    const idx = ((roundIdx % 4) + 4) % 4;
    return members[idx] ?? null;
  }
  if (battle === "champion") {
    return CHAMPIONS[gen] ?? null;
  }
  return null;
}

function getOpponentCount(battle: BattleKind, gen: GenerationId): number {
  if (battle === "gym") return GYM_LEADERS[gen]?.length ?? 0;
  if (battle === "elite") return 4;
  if (battle === "champion") return 1;
  return 5;
}

export function renderGenerationOptions(): void {
  const sel = byId<HTMLSelectElement>("sel-gen");
  sel.innerHTML = (Object.entries(GENERATIONS) as [string, string][])
    .map(([k, v]) => `<option value="${k}">${escapeHtml(v)}</option>`)
    .join("");
}

// Seule l'Attaque+ (x-attack) influe sur le % de victoire — on ne rend que
// cet item. Les potions (retry_bonus) restent gérées par la logique mais sont
// volontairement masquées de l'UI d'aide à la décision.
export function renderItemButtons(onAdjust: (key: string, delta: number) => void): void {
  const grid = byId("items-grid");
  const slug = "x-attack";
  const item = ITEMS[slug];
  if (!item) return;
  grid.innerHTML = `
    <div class="item-slot" id="itm-${slug}" data-item="${slug}">
      <div class="item-slot-sprite-wrap">
        <img class="item-slot-sprite" src="${escapeHtml(item.sprite)}" alt="Attaque +">
      </div>
      <div class="item-slot-name">Attaque +</div>
      <div class="item-slot-stepper">
        <button type="button" class="stepper-btn" data-action="dec" aria-label="Retirer une Attaque +">−</button>
        <span class="stepper-count">0</span>
        <button type="button" class="stepper-btn" data-action="inc" aria-label="Ajouter une Attaque +">+</button>
      </div>
    </div>`;
  const slot = byId(`itm-${slug}`);
  slot
    .querySelector<HTMLButtonElement>('[data-action="inc"]')
    ?.addEventListener("click", () => onAdjust(slug, 1));
  slot
    .querySelector<HTMLButtonElement>('[data-action="dec"]')
    ?.addEventListener("click", () => onAdjust(slug, -1));
}

function roundOptionLabel(battle: BattleKind, gen: GenerationId, idx: number): string {
  if (battle === "gym") {
    const leader = GYM_LEADERS[gen]?.[idx];
    if (leader) return leader.nameFr;
  } else if (battle === "elite") {
    const member = ELITE_FOUR[gen]?.[idx];
    if (member) return member.nameFr;
  } else if (battle === "champion") {
    const champ = CHAMPIONS[gen];
    if (champ) return champ.nameFr;
  }
  return `${ROUND_FALLBACK_LABEL[battle]} ${idx + 1}`;
}

export function renderRounds(battle: BattleKind, gen: GenerationId, prev: number): void {
  const count = getOpponentCount(battle, gen);
  const sel = byId<HTMLSelectElement>("sel-round");
  const opts = Array.from({ length: Math.max(count, 1) }, (_, i) => {
    const label = escapeHtml(roundOptionLabel(battle, gen, i));
    return `<option value="${i}"${i === prev ? " selected" : ""}>${label}</option>`;
  });
  sel.innerHTML = opts.join("");
}

export function renderOpponent(battle: BattleKind, gen: GenerationId, roundIdx: number): void {
  const opp = getOpponentObject(battle, gen, roundIdx);
  const nameEl = byId("opp-name");
  const typesEl = byId("opp-types");
  const spriteEl = byId("opp-sprite");
  if (opp) {
    nameEl.textContent = opp.nameFr || opp.name || "?";
    const tags = opp.types
      .filter((t) => t !== "various")
      .map(typeTag)
      .join("");
    typesEl.innerHTML =
      tags || '<span style="color:var(--hint);font-size:12px">Types variés</span>';
    spriteEl.innerHTML = opponentSpriteImgs(opp.sprite, opp.nameFr || opp.name || "");
  } else {
    nameEl.textContent = "—";
    typesEl.innerHTML = "";
    spriteEl.innerHTML = "";
  }
}

// Rendu d'un slot pokémon (utilisé par team et box). Slot vide = conteneur
// sans contenu avec bordure pointillée côté CSS. Un second bouton permet de
// déplacer le pokémon entre équipe et boîte (direction selon `dest`).
function pokeSlotHtml(
  p: UIPokemon | undefined,
  dest: "team" | "box",
  idx: number,
  canMove: boolean,
): string {
  if (!p) {
    return `<div class="poke-slot poke-slot-empty" aria-label="Emplacement ${idx + 1} vide"></div>`;
  }
  const types = `${typeTag(p.type1)}${p.type2 ? typeTag(p.type2) : ""}`;
  const sprite = p.id
    ? `<img class="poke-slot-sprite" src="${pokemonSpriteUrl(p.id)}" alt="${escapeHtml(p.name)}" loading="lazy">`
    : "";
  const moveIcon = dest === "team" ? "▼" : "▲";
  const moveLabel =
    dest === "team"
      ? `Envoyer ${escapeHtml(p.name)} dans la boîte PC`
      : `Mettre ${escapeHtml(p.name)} dans l'équipe`;
  const disabled = canMove ? "" : " disabled";
  const moveTitle = !canMove && dest === "box" ? ' title="Équipe complète"' : "";
  return `
    <div class="poke-slot">
      <button type="button" class="poke-slot-move poke-move" data-dest="${dest}" data-idx="${idx}" aria-label="${moveLabel}"${moveTitle}${disabled}>${moveIcon}</button>
      <button type="button" class="poke-slot-remove poke-remove" data-dest="${dest}" data-idx="${idx}" aria-label="Retirer ${escapeHtml(p.name)}">✕</button>
      <div class="poke-slot-sprite-wrap">${sprite}</div>
      <span class="poke-slot-name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</span>
      <span class="poke-slot-types">${types}</span>
      <span class="poke-slot-power">${p.power ?? 1}</span>
    </div>`;
}

// Équipe : TEAM_MAX (6) slots fixes. Le déplacement team → box est toujours
// possible (la boîte n'a pas de limite).
function renderTeamGrid(): void {
  const el = byId("team-list");
  el.innerHTML = Array.from({ length: TEAM_MAX }, (_, i) =>
    pokeSlotHtml(team[i], "team", i, true),
  ).join("");
}

// Boîte PC : 2×5 = 10 slots minimum, s'étend ligne par ligne (par 5) si on
// dépasse. L'affichage figé garantit que l'utilisateur voit la grille même vide.
// Le bouton box → team est désactivé quand l'équipe est pleine.
const BOX_MIN_SLOTS = 10;
const BOX_COLS = 5;
function renderBoxGrid(): void {
  const el = byId("box-list");
  const slotCount = Math.max(BOX_MIN_SLOTS, Math.ceil(box.length / BOX_COLS) * BOX_COLS);
  const canPromote = team.length < TEAM_MAX;
  el.innerHTML = Array.from({ length: slotCount }, (_, i) =>
    pokeSlotHtml(box[i], "box", i, canPromote),
  ).join("");
}

export function renderLists(
  onRemove: (dest: "team" | "box", idx: number) => void,
  onMove: (dest: "team" | "box", idx: number) => void,
): void {
  byId("team-count").textContent = `(${team.length}/${TEAM_MAX})`;
  byId("box-count").textContent = `(${box.length})`;
  renderTeamGrid();
  renderBoxGrid();

  for (const btn of document.querySelectorAll<HTMLButtonElement>(".poke-remove")) {
    btn.addEventListener("click", () => {
      const dest = btn.dataset["dest"] as "team" | "box";
      const idx = Number(btn.dataset["idx"]);
      onRemove(dest, idx);
    });
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>(".poke-move")) {
    btn.addEventListener("click", () => {
      const dest = btn.dataset["dest"] as "team" | "box";
      const idx = Number(btn.dataset["idx"]);
      onMove(dest, idx);
    });
  }
}

export function renderResult(battle: BattleKind, gen: GenerationId, roundIdx: number): void {
  const result = calcVictoryOdds(team, box, getItemsHeld(), battle, gen, roundIdx);

  byId("r-yes").textContent = String(result.yes);
  byId("r-no").textContent = String(result.no);
  byId("r-pct").textContent = `${result.pct}%`;

  const bar = byId<HTMLDivElement>("r-bar");
  bar.style.width = `${result.pct}%`;
  bar.style.background = result.pct >= 60 ? "#1D9E75" : result.pct >= 40 ? "#EF9F27" : "#E24B4A";

  const cls = result.pct >= 60 ? "good" : result.pct >= 40 ? "warn" : "bad";
  const pctMetric = byId("r-pct-metric");
  pctMetric.classList.remove("metric-good", "metric-warn", "metric-bad");
  pctMetric.classList.add(`metric-${cls}`);
  const msg =
    result.pct >= 60
      ? `Facile, enlève un pokémon si t'es un vrai gamer`
      : result.pct >= 40
        ? `T'es même pas cap de tenter comme ça tfaçon`
        : `C'est mort. Alt+F4 !`;
  byId("r-advice").innerHTML = `<div class="advice ${cls}">${msg}</div>`;

  const matchupEl = byId("r-matchup");
  if (result.opp_types.length > 0) {
    matchupEl.innerHTML = `Adversaire : ${result.opp_types
      .map(typeTag)
      .join(
        "",
      )} — <strong>${result.strong_count}</strong> pokémon(s) forts, <strong>${result.weak_count}</strong> faible(s).`;
  } else {
    matchupEl.innerHTML = "";
  }

  byId("r-retry").textContent =
    result.retry_bonus > 0
      ? `+ ${result.retry_bonus} tentative(s) supplémentaire(s) grâce aux potions.`
      : "";

  const swapList = byId("swap-list");
  if (result.swap_suggestions.length === 0) {
    swapList.innerHTML =
      box.length > 0
        ? '<p class="empty-hint">Aucun swap avantageux avec la boîte actuelle.</p>'
        : '<p class="empty-hint">Ajoutez des Pokémons dans la boîte PC pour voir les suggestions.</p>';
  } else {
    swapList.innerHTML = result.swap_suggestions
      .map((s) => {
        const remove = s.remove as UIPokemon;
        const add = s.add as UIPokemon;
        return `
          <div class="swap-row">
            <span class="swap-poke">${spriteImg(remove.id, remove.name)}${escapeHtml(remove.name)} ${typeTag(remove.type1)}${
              remove.type2 ? typeTag(remove.type2) : ""
            }</span>
            <span class="swap-arrow">→</span>
            <span class="swap-poke">${spriteImg(add.id, add.name)}${escapeHtml(add.name)} ${typeTag(add.type1)}${
              add.type2 ? typeTag(add.type2) : ""
            }</span>
            <span class="swap-gain">+${s.gain}% (→ ${s.new_pct}%)</span>
          </div>`;
      })
      .join("");
  }

  renderBestTeam(battle, gen, roundIdx, result.pct);
}

// Recherche exhaustive parmi team ∪ box. N'affiche que si un gain > 0 existe :
// l'équipe actuelle optimale produit un bloc neutre "déjà optimale".
function renderBestTeam(
  battle: BattleKind,
  gen: GenerationId,
  roundIdx: number,
  currentPct: number,
): void {
  const el = byId("best-team");
  if (team.length === 0 && box.length === 0) {
    el.innerHTML = '<p class="empty-hint">—</p>';
    return;
  }

  const best = findBestTeam(team, box, getItemsHeld(), battle, gen, roundIdx);
  if (best.gain <= 0) {
    el.innerHTML = '<p class="empty-hint">Ton équipe actuelle est déjà optimale. ✓</p>';
    return;
  }

  const pokeLine = (p: UIPokemon): string =>
    `<span class="swap-poke">${spriteImg(p.id, p.name)}${escapeHtml(p.name)} ${typeTag(p.type1)}${
      p.type2 ? typeTag(p.type2) : ""
    }</span>`;

  const addedHtml = best.added.length
    ? `<div class="best-line"><span class="best-label">Entrer :</span>${(best.added as UIPokemon[])
        .map(pokeLine)
        .join("")}</div>`
    : "";
  const removedHtml = best.removed.length
    ? `<div class="best-line"><span class="best-label">Sortir :</span>${(best.removed as UIPokemon[])
        .map(pokeLine)
        .join("")}</div>`
    : "";

  el.innerHTML = `
    <div class="best-header">
      <span class="swap-gain">+${best.gain}% (${currentPct}% → ${best.pct}%)</span>
      <span class="best-size">équipe de ${best.team.length}</span>
    </div>
    ${addedHtml}
    ${removedHtml}`;
}

export function syncItemButtons(): void {
  for (const slot of document.querySelectorAll<HTMLElement>(".item-slot")) {
    const key = slot.dataset["item"];
    if (!key) continue;
    const count = itemCounts[key] ?? 0;
    slot.classList.toggle("active", count > 0);
    const countEl = slot.querySelector<HTMLElement>(".stepper-count");
    if (countEl) countEl.textContent = String(count);
    const decBtn = slot.querySelector<HTMLButtonElement>('[data-action="dec"]');
    if (decBtn) decBtn.disabled = count === 0;
  }
}
