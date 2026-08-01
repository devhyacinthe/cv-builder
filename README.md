# CV Builder ATS

Application web personnelle de création de CV et de lettres de motivation optimisés pour les
systèmes de recrutement automatisés (ATS). Aucune donnée ne quitte le navigateur.

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # vérification TypeScript stricte
npm run generate   # site statique dans .output/public
```

## Architecture

```
schemas/      Modèle de données (Zod) — source de vérité des types
stores/       État applicatif (Pinia) : profil, documents
composables/  Logique réutilisable (persistance…)
utils/        Fonctions pures (dates, collections, stockage)
components/   base/ : kit d'interface — cv/ : rendu des documents
pages/        Écrans de l'éditeur
```

Principes : le profil est saisi une seule fois et alimente tous les documents ; les templates sont
des composants indépendants qui ne modifient jamais les données ; la logique reste séparée de
l'affichage.

## Pile technique

Nuxt 3 (rendu client uniquement) · Vue 3 · TypeScript strict · Tailwind CSS 4 · Pinia · Zod.
Aucune dépendance supplémentaire : l'export PDF s'appuiera sur le moteur d'impression du
navigateur, ce qui garantit un texte sélectionnable, donc lisible par les ATS.
