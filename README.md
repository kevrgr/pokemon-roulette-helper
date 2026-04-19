# Pokemon Roulette Helper

Outil d'aide à la décision pour le mod [zeroxm/pokemon-roulette](https://github.com/zeroxm/pokemon-roulette).
Reproduit côté navigateur la logique de probabilité du mod et suggère les
meilleurs swaps avant un combat.

**→ [Démo en ligne](https://kevrgr.github.io/pokemon-roulette-helper/)**

## Fonctionnalités

- Probabilité de victoire en temps réel selon la génération, le type de combat
  (arène / conseil des 4 / champion) et le round
- Suggestions de swap équipe ↔ boîte PC classées par gain
- Déplacement direct d'un pokémon entre équipe et boîte PC
- Prise en compte des items et des avantages de type
- Autocomplétion des 1025 pokémons + formes alternatives du mod (Hisui, Alola,
  Galar, Mega, …) avec sprites officiels PokeAPI

## Développement

Node 24 (pinné via `mise.toml`).

```bash
npm install
npm run dev     # serveur de dev  → http://localhost:5173
npm run build   # bundle statique → dist/
npm run test    # suite Vitest
```

Déploiement automatique sur GitHub Pages à chaque push sur `main`
([`./.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)).

## Crédits

- Mod d'origine : [zeroxm/pokemon-roulette](https://github.com/zeroxm/pokemon-roulette)
- Sprites pokémons / items / types : [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Sprites de dresseurs : [zeroxm/pokemon-roulette-trainer-sprites](https://github.com/zeroxm/pokemon-roulette-trainer-sprites)
