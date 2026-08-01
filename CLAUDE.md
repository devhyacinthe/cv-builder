# CV Builder ATS - Personal Resume Generator

## 1. Présentation du projet

**CV Builder ATS** est une application web personnelle permettant de créer, personnaliser et exporter des CV professionnels optimisés pour les systèmes de recrutement automatisés (**ATS - Applicant Tracking System**).

L'objectif principal est de disposer d'un outil personnel permettant de créer rapidement plusieurs versions de CV adaptées à différents objectifs professionnels :

* CV orienté Intelligence Artificielle
* CV orienté Big Data / Data Engineering
* CV orienté Développement logiciel
* CV orienté Recherche académique
* CV orienté Stage / Premier emploi

L'application doit permettre de séparer complètement :

* les données personnelles et professionnelles ;
* la logique de création du CV ;
* la présentation graphique du CV.

Les informations saisies une seule fois doivent pouvoir être réutilisées dans plusieurs modèles de CV.

---

# 2. Objectifs principaux

L'application doit permettre :

1. Créer et gérer un profil professionnel complet.
2. Ajouter différentes expériences professionnelles.
3. Ajouter des projets techniques.
4. Ajouter des formations et certifications.
5. Organiser les compétences.
6. Choisir différents modèles de CV.
7. Visualiser le CV en temps réel.
8. Exporter le CV en PDF.
9. Vérifier certaines règles de compatibilité ATS.

---

# 3. Utilisateur cible

Version actuelle :

Application personnelle utilisée par un seul utilisateur.

Il n'est pas nécessaire dans la première version de gérer :

* authentification ;
* multi-utilisateurs ;
* paiement ;
* administration.

L'application doit cependant être conçue de manière évolutive pour permettre une future transformation en SaaS.

---

# 4. Fonctionnalités principales

## 4.1 Gestion du profil personnel

L'utilisateur doit pouvoir gérer :

### Informations générales

* Nom complet
* Titre professionnel
* Email
* Téléphone
* Localisation
* LinkedIn
* GitHub
* Portfolio personnel
* Photo professionnelle

### Résumé professionnel

Une section permettant d'ajouter :

* une présentation courte ;
* un résumé professionnel ;
* un objectif de carrière.

---

# 4.2 Gestion des expériences professionnelles

Chaque expérience doit contenir :

* Entreprise
* Poste occupé
* Localisation
* Date de début
* Date de fin
* Expérience actuelle ou non
* Description détaillée
* Technologies utilisées
* Compétences associées

Exemple :

```
Entreprise : X

Poste :
Data Engineer Intern

Période :
Mars 2026 - Août 2026

Description :
Développement d'un pipeline Big Data utilisant Spark et Kafka.
```

L'utilisateur doit pouvoir :

* ajouter une expérience ;
* modifier une expérience ;
* supprimer une expérience ;
* changer l'ordre d'affichage.

---

# 4.3 Gestion des formations

Chaque formation contient :

* établissement ;
* diplôme ;
* domaine ;
* période ;
* description ;
* projets associés.

Exemple :

```
Master Informatique
Spécialité IA et Big Data
```

---

# 4.4 Gestion des projets

Cette section est très importante.

Chaque projet contient :

* Nom du projet
* Description
* Contexte
* Technologies utilisées
* Résultats obtenus
* Liens :

  * GitHub
  * Démo
  * Documentation

Exemple :

```
Projet :
Plateforme Big Data temps réel

Technologies :
Kafka, Spark, Hadoop, Docker

Description :
Création d'une architecture distribuée de traitement de données temps réel.
```

---

# 4.5 Gestion des compétences

Les compétences doivent être organisées par catégories.

Exemple :

## Programmation

* Python
* Java
* JavaScript
* TypeScript

## Intelligence Artificielle

* Machine Learning
* Deep Learning
* PyTorch
* Transformers

## Big Data

* Hadoop
* Spark
* Kafka

## Bases de données

* PostgreSQL
* MongoDB

## DevOps

* Docker
* Git
* Linux

L'utilisateur doit pouvoir :

* ajouter une compétence ;
* supprimer une compétence ;
* changer la catégorie.

---

# 5. Système de templates CV

L'application doit proposer 5 modèles différents.

Tous les modèles doivent utiliser les mêmes données.

Le changement de modèle ne doit jamais modifier le contenu du CV.

---

## Template 1 : ATS Classic

Objectif :

CV très compatible avec les ATS.

Caractéristiques :

* une seule colonne ;
* aucune décoration excessive ;
* structure claire ;
* titres standards.

Utilisation :

* informatique ;
* ingénierie ;
* finance ;
* grandes entreprises.

---

## Template 2 : Modern Professional

Caractéristiques :

* design moderne ;
* couleurs sobres ;
* meilleure hiérarchie visuelle.

---

## Template 3 : Engineer

Adapté aux profils :

* développeur ;
* ingénieur logiciel ;
* data engineer.

Accent sur :

* projets ;
* technologies ;
* compétences techniques.

---

## Template 4 : Academic / Research

Adapté aux :

* chercheurs ;
* étudiants ;
* candidatures universitaires.

Accent sur :

* formation ;
* publications ;
* projets scientifiques.

---

## Template 5 : Executive

Adapté aux :

* managers ;
* consultants ;
* chefs de projet.

---

# 6. Prévisualisation en temps réel

L'utilisateur doit voir immédiatement le résultat final.

Architecture souhaitée :

```
Données CV

↓

Template sélectionné

↓

Prévisualisation
```

Toute modification dans le formulaire doit mettre à jour automatiquement le CV.

---

# 7. Export PDF

L'application doit permettre :

* export PDF haute qualité ;
* conservation de la mise en page ;
* respect des marges ;
* texte sélectionnable dans le PDF.

Le PDF généré doit être compatible avec les logiciels ATS.

---

# 8. Analyse ATS

Une première version simple doit analyser :

## Structure

Vérifier :

* présence des sections principales ;
* ordre logique ;
* titres standards.

## Lisibilité

Vérifier :

* longueur du CV ;
* sections vides ;
* contenu insuffisant.

## Mots-clés

Permettre éventuellement d'ajouter une offre d'emploi et détecter :

* mots-clés présents ;
* mots-clés absents.

---

# 9. Gestion des versions

L'utilisateur doit pouvoir créer plusieurs CV.

Exemple :

```
Mes CV

├── CV Data Scientist
├── CV Data Engineer
├── CV Software Engineer
└── CV Recherche IA
```

Chaque CV peut avoir :

* son propre template ;
* ses propres expériences visibles ;
* ses propres projets visibles.

---

# 10. Stockage des données

Version initiale :

Stockage local.

Solutions possibles :

* LocalStorage ;
* IndexedDB.

Les données doivent rester disponibles après fermeture du navigateur.

---

# 11. Stack technique

## Frontend

* Nuxt 3
* Vue 3
* TypeScript
* Tailwind CSS

## Gestion état

* Pinia

## Validation

* Zod

## Génération PDF

Utiliser une solution adaptée au rendu HTML/Vue.

## Déploiement

* GitHub Pages

L'application doit fonctionner sans backend.

---

# 12. Structure logique recommandée

```
Application

├── CV Data Layer

├── Editor

├── Template Engine

├── Preview System

├── ATS Analyzer

└── PDF Export
```

---

# 13. Contraintes importantes

L'application doit respecter :

* code propre ;
* composants réutilisables ;
* séparation logique / affichage ;
* TypeScript strict ;
* design responsive ;
* interface simple ;
* architecture évolutive.

---
# 9. Module Lettre de motivation

L'application doit également intégrer un module permettant de créer, personnaliser et exporter des lettres de motivation professionnelles.

L'objectif est de permettre à l'utilisateur de créer des lettres adaptées à chaque candidature en réutilisant ses informations professionnelles.

---

# 9.1 Gestion des lettres de motivation

L'utilisateur doit pouvoir créer plusieurs lettres.

Exemple :

```
Mes lettres

├── Lettre Stage Data Engineer
├── Lettre Ingénieur IA
├── Lettre Recherche Master / Doctorat
└── Lettre Candidature spontanée
```

Chaque lettre doit être indépendante et associée éventuellement à un CV spécifique.

---

# 9.2 Structure d'une lettre

Une lettre doit contenir :

## Informations personnelles

* Nom
* Coordonnées
* Email
* Téléphone
* Liens professionnels

## Informations du destinataire

* Nom de l'entreprise
* Nom du recruteur (optionnel)
* Adresse
* Poste visé

## Contenu de la lettre

Sections :

### Introduction

Objectif :

* présenter la candidature ;
* préciser le poste recherché ;
* expliquer la motivation principale.

---

### Présentation du profil

Contenu :

* formation ;
* expériences principales ;
* domaines d'expertise.

---

### Expériences et compétences

Mettre en avant :

* projets pertinents ;
* compétences techniques ;
* réalisations ;
* résultats obtenus.

---

### Motivation pour l'entreprise

Permettre d'expliquer :

* pourquoi cette entreprise ;
* pourquoi ce poste ;
* pourquoi ce domaine.

---

### Conclusion

Inclure :

* disponibilité ;
* demande d'entretien ;
* formule de politesse.

---

# 9.3 Templates de lettres de motivation

L'application doit proposer plusieurs modèles.

Exemples :

## Template 1 : Classique professionnel

Adapté aux :

* grandes entreprises ;
* administrations ;
* candidatures classiques.

Caractéristiques :

* structure simple ;
* très lisible ;
* compatible avec les standards professionnels.

---

## Template 2 : Moderne

Caractéristiques :

* design plus actuel ;
* meilleure hiérarchie visuelle ;
* couleurs sobres.

---

## Template 3 : Académique / Recherche

Adapté aux :

* stages recherche ;
* laboratoires ;
* candidatures universitaires.

Accent sur :

* parcours académique ;
* projets ;
* travaux scientifiques.

---

# 9.4 Assistance intelligente future

Le module lettre de motivation doit être conçu pour permettre une évolution vers une assistance IA.

Fonctionnalités futures possibles :

* génération automatique d'une lettre à partir d'un CV ;
* adaptation d'une lettre à une offre d'emploi ;
* amélioration du style rédactionnel ;
* correction grammaticale ;
* changement du niveau de formalité.

Exemple :

Entrée utilisateur :

```
Je veux postuler comme Data Engineer chez une entreprise utilisant Spark.
```

Sortie attendue :

Une lettre professionnelle mettant en avant :

* les projets Big Data ;
* les compétences Spark/Kafka ;
* les expériences pertinentes.

---

# 10. Templates de référence fournis par l'utilisateur

Des fichiers exemples seront fournis afin de servir de référence pour la création des designs.

Ces fichiers peuvent être :

* captures d'écran ;
* fichiers PDF ;
* images ;
* modèles de CV existants ;
* exemples de lettres de motivation.

L'objectif est que l'application reproduise fidèlement les caractéristiques visuelles des modèles fournis.

Lorsqu'un template est fourni, il faut analyser :

## Structure

* organisation des sections ;
* ordre des informations ;
* disposition des blocs.

## Design

* couleurs utilisées ;
* typographie ;
* tailles des titres ;
* espacements ;
* marges ;
* alignements.

## Style

* niveau de sobriété ;
* style professionnel ou créatif ;
* utilisation éventuelle d'éléments graphiques.

---

# Règles pour l'implémentation des templates

Les templates doivent être développés comme des composants indépendants.

Principe :

```
Données CV

        +

Template sélectionné

        ↓

Rendu final
```

Un changement de template ne doit jamais modifier les données.

Chaque nouveau modèle fourni doit pouvoir être ajouté sans modifier la logique principale de l'application.

---

# Gestion des versions des templates

L'application doit permettre une évolution facile du système de design.

Exemple :

```
templates/

├── cv/
│   ├── ats-classic
│   ├── modern
│   ├── engineer
│   └── academic
│
└── cover-letter/
    ├── classic
    ├── modern
    └── research
```

Chaque template possède :

* ses propres composants ;
* ses propres styles ;
* ses propres règles de mise en page.

---

# 14. Évolutions futures possibles

## Intelligence artificielle

Ajouter un assistant IA capable de :

* améliorer les descriptions d'expériences ;
* transformer des phrases simples en descriptions professionnelles ;
* adapter un CV à une offre d'emploi ;
* générer une lettre de motivation.

## Backend

Possibilité future d'ajouter :

* authentification ;
* synchronisation cloud ;
* sauvegarde multi-appareils.

---

# 15. Résultat attendu

À la fin, l'application doit permettre :

1. D'entrer toutes les informations professionnelles une seule fois.
2. De créer plusieurs CV spécialisés.
3. De changer de design instantanément.
4. D'obtenir un PDF professionnel.
5. D'avoir un CV clair, moderne et compatible ATS.

Le projet doit être considéré comme une application professionnelle et non comme un simple générateur de documents.
