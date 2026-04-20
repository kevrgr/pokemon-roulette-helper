// Bootstrap de l'UI : événements + recalcul après chaque action.

import type { BattleKind, GenerationId, PokedexEntry } from "../types/battle.js";
import { byId, escapeHtml } from "./dom.js";
import { getEvolutions } from "../logic/evolutions.js";
import { findExactByName, searchPokedex } from "./pokedex-search.js";
import {
  pokemonSpriteUrl,
  renderGenerationOptions,
  renderItemButtons,
  renderLists,
  renderOpponent,
  renderResult,
  renderRounds,
  syncItemButtons,
} from "./render.js";
import { box, itemCounts, team, TEAM_MAX, type UIPokemon } from "./state.js";

function readGen(): GenerationId {
  const raw = byId<HTMLSelectElement>("sel-gen").value;
  const n = Number(raw);
  return n as GenerationId;
}

function readBattle(): BattleKind {
  return byId<HTMLSelectElement>("sel-battle").value as BattleKind;
}

function readRound(): number {
  const raw = byId<HTMLSelectElement>("sel-round").value;
  return Number.parseInt(raw, 10) || 0;
}

function recalc(): void {
  renderResult(readBattle(), readGen(), readRound());
}

function refreshOpponent(): void {
  renderOpponent(readBattle(), readGen(), readRound());
}

function onConfigChange(): void {
  refreshOpponent();
  recalc();
}

function onBattleChange(): void {
  const prevRound = readRound();
  renderRounds(readBattle(), readGen(), prevRound);
  onConfigChange();
}

function onGenChange(): void {
  const prevRound = readRound();
  renderRounds(readBattle(), readGen(), prevRound);
  onConfigChange();
}


function removePoke(dest: "team" | "box", idx: number): void {
  if (dest === "team") team.splice(idx, 1);
  else box.splice(idx, 1);
  renderListsAndRecalc();
}

// Déplacement entre équipe et boîte. Équipe → Boîte toujours permis (boîte
// illimitée). Boîte → Équipe refusé silencieusement si l'équipe est pleine :
// le bouton est aussi désactivé côté render pour matérialiser l'état.
function movePoke(from: "team" | "box", idx: number): void {
  if (from === "team") {
    const [pk] = team.splice(idx, 1);
    if (pk) box.push(pk);
  } else {
    if (team.length >= TEAM_MAX) return;
    const [pk] = box.splice(idx, 1);
    if (pk) team.push(pk);
  }
  renderListsAndRecalc();
}

function evolvePoke(dest: "team" | "box", idx: number, entry: PokedexEntry): void {
  const arr = dest === "team" ? team : box;
  const pk: UIPokemon = { name: entry.nameFr, type1: entry.type1, power: entry.power, id: entry.id };
  if (entry.type2) pk.type2 = entry.type2;
  arr[idx] = pk;
  renderListsAndRecalc();
}

function startEvolveInline(dest: "team" | "box", idx: number): void {
  const gridId = dest === "team" ? "team-list" : "box-list";
  const slotEl = byId(gridId).querySelectorAll<HTMLElement>(".poke-slot")[idx];
  if (!slotEl || slotEl.classList.contains("poke-slot-empty")) return;

  const arr = dest === "team" ? team : box;
  const current = arr[idx];
  if (!current?.id) return;

  const evolutions = getEvolutions(current.id);

  slotEl.querySelector(".evolve-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "evolve-overlay";

  if (evolutions.length === 0) {
    overlay.innerHTML = `<span class="evolve-none">Pas d'évolution</span>
      <button type="button" class="evolve-cancel">✕</button>`;
    overlay.querySelector(".evolve-cancel")?.addEventListener("click", () => overlay.remove());
  } else {
    overlay.innerHTML = `
      <button type="button" class="evolve-cancel" aria-label="Annuler">✕</button>
      <ul class="evolve-list">
        ${evolutions
          .map(
            (e, i) => `
          <li class="evolve-option" data-idx="${i}">
            <img class="poke-sprite" src="${pokemonSpriteUrl(e.id)}" alt="${escapeHtml(e.nameFr)}" loading="lazy" width="40" height="40">
            <span class="evolve-option-name">${escapeHtml(e.nameFr)}</span>
          </li>`,
          )
          .join("")}
      </ul>`;
    overlay.querySelector(".evolve-cancel")?.addEventListener("click", () => overlay.remove());
    for (const li of overlay.querySelectorAll<HTMLLIElement>(".evolve-option")) {
      li.addEventListener("click", () => {
        const entry = evolutions[Number(li.dataset["idx"])];
        if (entry) { overlay.remove(); evolvePoke(dest, idx, entry); }
      });
    }
  }

  slotEl.appendChild(overlay);
  overlay.addEventListener("mouseleave", () => overlay.remove());
}

function startAddInline(dest: "team" | "box", idx: number, swapMode = false): void {
  const gridId = dest === "team" ? "team-list" : "box-list";
  const slotMaybe = byId(gridId).querySelectorAll<HTMLElement>(".poke-slot")[idx];
  if (!slotMaybe) return;
  const isEmpty = slotMaybe.classList.contains("poke-slot-empty");
  if (swapMode ? isEmpty : !isEmpty) return;
  const slotEl: HTMLElement = slotMaybe;

  slotEl.querySelector(".add-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "add-overlay";
  slotEl.classList.add("poke-slot-adding");

  let localMatches: PokedexEntry[] = [];
  let localActiveIdx = -1;

  overlay.innerHTML = `
    <button type="button" class="add-cancel" aria-label="Annuler">✕</button>
    <div class="add-autocomplete">
      <input type="text" class="add-input" placeholder="ex : Dracaufeu" autocomplete="off" spellcheck="false" />
      <ul class="add-suggestions autocomplete-list" hidden></ul>
    </div>`;

  const input = overlay.querySelector<HTMLInputElement>(".add-input")!;
  const list = overlay.querySelector<HTMLUListElement>(".add-suggestions")!;

  const svgTypeIcon = (t: string) =>
    `<img class="type-sprite" src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${t}.svg" alt="${t}" loading="lazy">`;

  function renderLocalSuggestions(): void {
    if (localMatches.length === 0) { list.hidden = true; list.innerHTML = ""; return; }
    list.innerHTML = localMatches
      .map(
        (e, i) => `
        <li class="autocomplete-item${i === localActiveIdx ? " active" : ""}" data-idx="${i}">
          <img class="poke-sprite" src="${pokemonSpriteUrl(e.id)}" alt="${escapeHtml(e.nameFr)}" loading="lazy" width="24" height="24">
          <span class="autocomplete-item-name">${escapeHtml(e.nameFr)}</span>
          <span class="autocomplete-item-types">${svgTypeIcon(e.type1)}${e.type2 ? svgTypeIcon(e.type2) : ""}</span>
        </li>`,
      )
      .join("");
    list.hidden = false;
    for (const li of list.querySelectorAll<HTMLLIElement>(".autocomplete-item")) {
      li.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        const entry = localMatches[Number(li.dataset["idx"])];
        if (entry) confirmAdd(entry);
      });
    }
  }

  function confirmAdd(entry: PokedexEntry): void {
    const pk: UIPokemon = { name: entry.nameFr, type1: entry.type1, power: entry.power, id: entry.id };
    if (entry.type2) pk.type2 = entry.type2;
    if (swapMode) {
      const arr = dest === "team" ? team : box;
      arr[idx] = pk;
    } else if (dest === "team" && team.length < TEAM_MAX) {
      team.push(pk);
    } else if (dest === "box") {
      box.push(pk);
    }
    renderListsAndRecalc();
  }

  function closeOverlay(): void {
    slotEl.classList.remove("poke-slot-adding");
    overlay.remove();
    document.removeEventListener("click", onOutsideClick);
  }

  function onOutsideClick(ev: MouseEvent): void {
    if (!slotEl.contains(ev.target as Node)) closeOverlay();
  }

  input.addEventListener("input", () => {
    localMatches = searchPokedex(input.value);
    localActiveIdx = localMatches.length > 0 ? 0 : -1;
    renderLocalSuggestions();
  });

  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown" && localMatches.length > 0) {
      ev.preventDefault();
      localActiveIdx = (localActiveIdx + 1) % localMatches.length;
      renderLocalSuggestions();
    } else if (ev.key === "ArrowUp" && localMatches.length > 0) {
      ev.preventDefault();
      localActiveIdx = (localActiveIdx - 1 + localMatches.length) % localMatches.length;
      renderLocalSuggestions();
    } else if (ev.key === "Escape") {
      closeOverlay();
    } else if (ev.key === "Enter") {
      const highlighted = localActiveIdx >= 0 ? localMatches[localActiveIdx] : undefined;
      if (highlighted) { ev.preventDefault(); confirmAdd(highlighted); }
      else {
        const exact = findExactByName(input.value);
        if (exact) confirmAdd(exact);
      }
    }
  });

  overlay.querySelector(".add-cancel")?.addEventListener("click", closeOverlay);

  slotEl.appendChild(overlay);
  setTimeout(() => document.addEventListener("click", onOutsideClick), 0);
  input.focus();
}

function startSwapInline(dest: "team" | "box", idx: number): void {
  startAddInline(dest, idx, true);
}

function renderListsAndRecalc(): void {
  renderLists(removePoke, movePoke, startEvolveInline, startAddInline, startSwapInline);
  recalc();
}

function adjustItem(name: string, delta: number): void {
  const current = itemCounts[name] ?? 0;
  const next = Math.max(0, current + delta);
  if (next === current) return;
  itemCounts[name] = next;
  syncItemButtons();
  recalc();
}


export function bootstrap(): void {
  renderGenerationOptions();
  renderItemButtons(adjustItem);
  syncItemButtons();
  renderRounds(readBattle(), readGen(), 0);
  renderListsAndRecalc();
  refreshOpponent();

  byId<HTMLSelectElement>("sel-gen").addEventListener("change", onGenChange);
  byId<HTMLSelectElement>("sel-battle").addEventListener("change", onBattleChange);
  byId<HTMLSelectElement>("sel-round").addEventListener("change", onConfigChange);

}
