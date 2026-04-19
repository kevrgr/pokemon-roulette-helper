// Banker's rounding : JavaScript `Math.round` arrondit .5 vers le haut, mais l'historique
// de l'application repose sur l'arrondi vers le pair le plus proche (ex. 12.5 → 12).
// Indispensable pour la parité des pourcentages.

export function roundPy(value: number): number {
  const floor = Math.floor(value);
  const diff = value - floor;
  if (diff < 0.5) return floor;
  if (diff > 0.5) return floor + 1;
  // Pile à .5 : retour vers l'entier pair le plus proche.
  return floor % 2 === 0 ? floor : floor + 1;
}
