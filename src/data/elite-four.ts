// Conseil des 4 par génération.
// Source : zeroxm/pokemon-roulette (i18n FR : `src/assets/i18n/fr.json`,
// section `elite4`).

import type { EliteMember, GenerationId } from "../types/battle.js";

export const ELITE_FOUR: Record<GenerationId, EliteMember[]> = {
  1: [
    { name: "Lorelei", nameFr: "Olga", types: ["ice"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Masters_EX_Lorelei_artwork.png" },
    { name: "Bruno", nameFr: "Aldo", types: ["fighting"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Masters_EX_Bruno_artwork.png" },
    { name: "Agatha", nameFr: "Agatha", types: ["ghost"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Masters_EX_Agatha_artwork.png" },
    { name: "Lance", nameFr: "Peter", types: ["dragon"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Masters_EX_Lance_artwork.png" },
  ],
  2: [
    { name: "Will", nameFr: "Clément", types: ["psychic"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/HeartGold_SoulSilver_Will.png" },
    { name: "Koga", nameFr: "Koga", types: ["poison"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/HeartGold_SoulSilver_Koga.png" },
    { name: "Bruno", nameFr: "Bruno", types: ["fighting"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/HeartGold_SoulSilver_Bruno.png" },
    { name: "Karen", nameFr: "Marion", types: ["dark"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/HeartGold_SoulSilver_Karen.png" },
  ],
  3: [
    { name: "Sidney", nameFr: "Damien", types: ["dark"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Omega_Ruby_Alpha_Sapphire_Sidney.png" },
    { name: "Phoebe", nameFr: "Spectra", types: ["ghost"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Omega_Ruby_Alpha_Sapphire_Phoebe.png" },
    { name: "Glacia", nameFr: "Glacia", types: ["ice"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Omega_Ruby_Alpha_Sapphire_Glacia.png" },
    { name: "Drake", nameFr: "Aragon", types: ["dragon"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Omega_Ruby_Alpha_Sapphire_Drake.png" },
  ],
  4: [
    { name: "Aaron", nameFr: "Aaron", types: ["bug"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Diamond_Pearl_Aaron.png" },
    { name: "Bertha", nameFr: "Terry", types: ["ground"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Diamond_Pearl_Bertha.png" },
    { name: "Flint", nameFr: "Adrien", types: ["fire"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Diamond_Pearl_Flint.png" },
    { name: "Lucian", nameFr: "Lucio", types: ["psychic"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Diamond_Pearl_Lucian.png" },
  ],
  5: [
    { name: "Shauntal", nameFr: "Anis", types: ["ghost"], sprite: ["https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Black_White_Shauntal.png"] },
    { name: "Marshal", nameFr: "Kunz", types: ["fighting"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Black_White_Marshal.png" },
    { name: "Grimsley", nameFr: "Pieris", types: ["dark"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Black_White_Grimsley.png" },
    { name: "Caitlin", nameFr: "Percila", types: ["psychic"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Black_White_Caitlin.png" },
  ],
  6: [
    { name: "Malva", nameFr: "Malva", types: ["fire"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/XY_Malva.png" },
    { name: "Siebold", nameFr: "Thyméo", types: ["water"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/XY_Siebold.png" },
    { name: "Wikstrom", nameFr: "Wikstrom", types: ["steel"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/XY_Wikstrom.png" },
    { name: "Drasna", nameFr: "Dracéna", types: ["dragon"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/XY_Drasna.png" },
  ],
  7: [
    { name: "Molayne", nameFr: "Molène", types: ["steel"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sun_Moon_Molayne.png" },
    { name: "Olivia", nameFr: "Alyxia", types: ["rock"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sun_Moon_Olivia.png" },
    { name: "Acerola", nameFr: "Margie", types: ["ghost"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sun_Moon_Acerola.png" },
    { name: "Kahili", nameFr: "Kahili", types: ["flying"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sun_Moon_Kahili.png" },
  ],
  8: [
    {
      name: "Marnie / Nessa / Bea",
      nameFr: "Rosemary / Nabil / Travis",
      types: ["dark", "water", "fighting"],
      random: true,
      sprite: ["https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Marnie.png", "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Hop.png", "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Bede.png"],
    },
    { name: "Nessa", nameFr: "Donna", types: ["water"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Nessa.png" },
    {
      name: "Bea / Allister",
      nameFr: "Faïza / Allister",
      types: ["fighting", "ghost"],
      random: true,
      sprite: ["https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Bea.png", "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Allister.png"],
    },
    { name: "Raihan", nameFr: "Roy", types: ["dragon"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/Sword_Shield_Raihan.png" },
  ],
  9: [
    { name: "Rika", nameFr: "Rika", types: ["ground"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/VSRika.png" },
    { name: "Poppy", nameFr: "Poppy", types: ["steel"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/VSPoppy.png" },
    { name: "Larry", nameFr: "Larry", types: ["flying"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/VSLarry_2.png" },
    { name: "Hassel", nameFr: "Hassel", types: ["dragon"], sprite: "https://raw.githubusercontent.com/zeroxm/pokemon-roulette-trainer-sprites/refs/heads/main/sprites/VSHassel.png" },
  ],
};
