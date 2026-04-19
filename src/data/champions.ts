// Champions par génération.
// Le marqueur `various` est conservé pour l'affichage : la logique le filtre.
// Les `nameFr` viennent de l'i18n du mod source
// (`src/assets/i18n/fr.json`, section `champion`).

import type { Champion, GenerationId } from "../types/battle.js";

export const CHAMPIONS: Record<GenerationId, Champion> = {
  1: { name: "Blue", nameFr: "Blue", types: ["various"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/FireRed_LeafGreen_Blue.png" },
  2: { name: "Lance", nameFr: "Peter", types: ["dragon"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Masters_Lance_Dragonite_artwork.png" },
  3: { name: "Steven", nameFr: "Pierre", types: ["steel"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Omega_Ruby_Alpha_Sapphire_Steven.png" },
  4: { name: "Cynthia", nameFr: "Cynthia", types: ["various"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Diamond_Pearl_Cynthia.png" },
  5: { name: "Alder", nameFr: "Goyah", types: ["various"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Black_White_Alder.png" },
  6: { name: "Diantha", nameFr: "Dianthéa", types: ["various"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/XY_Diantha.png" },
  7: { name: "Kukui / Hau", nameFr: "Professeur Euphorbe / Tili", types: ["various"], sprite: ["https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sun_Moon_Professor_Kukui.png", "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/USUM_Hau.png"] },
  8: { name: "Leon", nameFr: "Tarak", types: ["various"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Leon.png" },
  9: { name: "Geeta", nameFr: "Geeta", types: ["various"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/VSGeeta.png" },
};
