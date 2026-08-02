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
stores/       État applicatif (Pinia) : profil, CV, lettres
composables/  Logique réutilisable (persistance, export, sauvegarde)
utils/        Fonctions pures (dates, collections, stockage, analyse ATS)
components/   base/ : kit d'interface — document/ : feuille A4 partagée
              cv/ et letter/ : rendu des deux familles de documents
pages/        Écrans de l'éditeur
```

Principes : le profil est saisi une seule fois et alimente tous les documents ; les modèles sont des
composants indépendants qui ne modifient jamais les données ; la logique reste séparée de
l'affichage. La feuille A4 est mutualisée — CV et lettres tiennent sur **une seule page**, resserrée
automatiquement jusqu'à une densité plancher.

Ajouter un modèle = créer son composant puis l'inscrire dans `constants/cvTemplates.ts` ou
`constants/letterTemplates.ts`. Rien d'autre ne change.

## Données

Tout est conservé dans le `localStorage` de ce navigateur, dans une enveloppe versionnée relue à
travers les schémas Zod. L'écran **Mes données** exporte l'ensemble (profil + CV + lettres) dans un
fichier JSON unique et le restaure à l'identique, sur cet appareil comme sur un autre.

## Export PDF

Le document est rendu dans une page dédiée puis confié au moteur d'impression du navigateur : le
PDF obtenu contient du vrai texte sélectionnable, donc lisible par les ATS, sans aucune dépendance
de génération.

## Déploiement

`.github/workflows/deploy.yml` publie automatiquement sur GitHub Pages à chaque push sur `main`. Le
workflow active Pages lui-même au premier passage (`enablement: true`) ; si l'organisation l'interdit,
faites-le une fois à la main : **Settings → Pages → Source : GitHub Actions**.

Le site est servi sur `https://<compte>.github.io/<dépôt>/` ; le chemin de base est injecté au build
via `NUXT_APP_BASE_URL`, il n'y a rien à modifier dans le code.

## Pile technique

Nuxt 3 (rendu client uniquement) · Vue 3 · TypeScript strict · Tailwind CSS 4 · Pinia · Zod.
Cinq dépendances au total : icônes, graphiques, animations et export PDF sont écrits à la main.
