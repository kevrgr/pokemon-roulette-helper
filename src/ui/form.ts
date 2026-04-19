// Bootstrap de l'UI : événements + recalcul après chaque action.

import type { BattleKind, GenerationId, PokedexEntry } from "../types/battle.js";
import { byId, escapeHtml } from "./dom.js";
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
  typeTag,
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

// Types et power sont toujours dérivés du pokédex : aucune saisie manuelle.
// Si le nom ne correspond à aucune entrée, on refuse l'ajout.
function addPoke(dest: "team" | "box"): void {
  const rawName = byId<HTMLInputElement>("inp-name").value.trim();
  const matched = rawName ? findExactByName(rawName) : null;
  if (!matched) return;

  const pk: UIPokemon = {
    name: matched.nameFr,
    type1: matched.type1,
    power: matched.power,
    id: matched.id,
  };
  if (matched.type2) pk.type2 = matched.type2;

  if (dest === "team" && team.length < TEAM_MAX) team.push(pk);
  else if (dest === "box") box.push(pk);

  clearForm();
  renderListsAndRecalc();
}

function clearForm(): void {
  byId<HTMLInputElement>("inp-name").value = "";
  hideSuggestions();
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

function renderListsAndRecalc(): void {
  renderLists(removePoke, movePoke);
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

// --- Autocomplétion nom FR → pré-remplit type1/type2/power -------------------

let activeIdx = -1;
let currentMatches: PokedexEntry[] = [];

function applyEntry(entry: PokedexEntry): void {
  byId<HTMLInputElement>("inp-name").value = entry.nameFr;
}

function renderSuggestions(): void {
  const list = byId<HTMLUListElement>("inp-name-suggestions");
  if (currentMatches.length === 0) {
    list.hidden = true;
    list.innerHTML = "";
    return;
  }
  list.innerHTML = currentMatches
    .map(
      (e, i) => `
      <li class="autocomplete-item${i === activeIdx ? " active" : ""}" data-idx="${i}">
        <span class="poke-id">#${e.id}</span>
        <img class="poke-sprite" src="${pokemonSpriteUrl(e.id)}" alt="${escapeHtml(e.nameFr)}" loading="lazy" width="24" height="24">
        <span class="autocomplete-item-name">${escapeHtml(e.nameFr)}</span>
        <span class="autocomplete-item-types">${typeTag(e.type1)}${e.type2 ? typeTag(e.type2) : ""}</span>
        <span class="poke-meta">pwr ${e.power}</span>
      </li>`,
    )
    .join("");
  list.hidden = false;

  for (const li of list.querySelectorAll<HTMLLIElement>(".autocomplete-item")) {
    li.addEventListener("mousedown", (ev) => {
      // mousedown plutôt que click : se déclenche avant le blur de l'input.
      ev.preventDefault();
      const idx = Number(li.dataset["idx"]);
      const entry = currentMatches[idx];
      if (entry) {
        applyEntry(entry);
        hideSuggestions();
      }
    });
  }
}

function hideSuggestions(): void {
  currentMatches = [];
  activeIdx = -1;
  const list = byId<HTMLUListElement>("inp-name-suggestions");
  list.hidden = true;
  list.innerHTML = "";
}

function onNameInput(): void {
  const value = byId<HTMLInputElement>("inp-name").value;
  currentMatches = searchPokedex(value);
  activeIdx = currentMatches.length > 0 ? 0 : -1;
  renderSuggestions();
}

function onNameKeydown(event: KeyboardEvent): void {
  if (event.key === "ArrowDown" && currentMatches.length > 0) {
    event.preventDefault();
    activeIdx = (activeIdx + 1) % currentMatches.length;
    renderSuggestions();
    return;
  }
  if (event.key === "ArrowUp" && currentMatches.length > 0) {
    event.preventDefault();
    activeIdx = (activeIdx - 1 + currentMatches.length) % currentMatches.length;
    renderSuggestions();
    return;
  }
  if (event.key === "Escape") {
    hideSuggestions();
    return;
  }
  if (event.key === "Enter") {
    const highlighted = activeIdx >= 0 ? currentMatches[activeIdx] : undefined;
    if (highlighted) {
      event.preventDefault();
      applyEntry(highlighted);
      hideSuggestions();
      return;
    }
    addPoke("team");
  }
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

  byId<HTMLButtonElement>("btn-add-team").addEventListener("click", () => addPoke("team"));
  byId<HTMLButtonElement>("btn-add-box").addEventListener("click", () => addPoke("box"));

  const nameInput = byId<HTMLInputElement>("inp-name");
  nameInput.addEventListener("input", onNameInput);
  nameInput.addEventListener("keydown", onNameKeydown);
  nameInput.addEventListener("blur", () => {
    // Laisse mousedown se déclencher avant de fermer.
    setTimeout(hideSuggestions, 120);
  });
  nameInput.addEventListener("focus", onNameInput);
}
