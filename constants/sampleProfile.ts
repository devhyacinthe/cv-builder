import type { Profile } from '~/schemas/profile'
import {
  createEducation,
  createExperience,
  createLanguage,
  createProject,
  createSkill,
  createSkillCategory,
  createSocialLink,
} from '~/utils/factories'

/**
 * Profil de démonstration : permet de découvrir l'interface, les statistiques
 * et les templates sans avoir à tout saisir. Remplaçable à tout moment.
 */
export const createSampleProfile = (): Profile => ({
  personal: {
    firstName: 'Camille',
    lastName: 'Dupont',
    title: 'Data Engineer',
    email: 'camille.dupont@mail.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    nationality: 'Française',
    birthDate: '1998-04',
    drivingLicence: 'Permis B',
    photo: '',
    links: [
      createSocialLink({ platform: 'linkedin', label: 'in/camille-dupont', url: 'https://linkedin.com/in/camille-dupont' }),
      createSocialLink({ platform: 'github', label: 'camille-dupont', url: 'https://github.com/camille-dupont' }),
    ],
  },
  summary: {
    headline: 'Ingénieure données orientée temps réel',
    content:
      "Ingénieure données spécialisée dans la conception de pipelines distribués. J'interviens de la collecte à la mise à disposition des données, avec un souci constant de fiabilité et de coût d'exploitation.",
    objective: 'Rejoindre une équipe produit pour industrialiser des traitements de données à grande échelle.',
  },
  experiences: [
    createExperience({
      company: 'Nordis Analytics',
      position: 'Data Engineer',
      location: 'Paris, France',
      startDate: '2024-01',
      current: true,
      description: "Conception et exploitation de la plateforme de données temps réel de l'entreprise.",
      highlights: [
        "Mise en production d'un pipeline Kafka/Spark traitant 12 millions d'événements par jour.",
        'Réduction de 35 % du coût de stockage par un partitionnement adapté.',
        'Mise en place des tests de qualité de données et des alertes associées.',
      ],
      technologies: ['Spark', 'Kafka', 'Python', 'Airflow', 'PostgreSQL', 'Docker'],
    }),
    createExperience({
      company: 'Atelier Numérique',
      position: 'Développeuse back-end',
      location: 'Lyon, France',
      startDate: '2022-03',
      endDate: '2023-12',
      description: "Développement des services d'une application de gestion logistique.",
      highlights: [
        "Développement d'API REST utilisées par 4 applications internes.",
        'Migration progressive vers une architecture conteneurisée.',
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    }),
  ],
  educations: [
    createEducation({
      institution: 'Université de Paris',
      degree: 'Master Informatique',
      field: 'Intelligence artificielle et Big Data',
      location: 'Paris, France',
      startDate: '2020-09',
      endDate: '2022-06',
      description: 'Mémoire consacré au traitement distribué de flux de données.',
      highlights: [],
    }),
    createEducation({
      institution: 'IUT de Lyon',
      degree: 'DUT Informatique',
      field: 'Développement logiciel',
      location: 'Lyon, France',
      startDate: '2018-09',
      endDate: '2020-06',
      description: '',
      highlights: [],
    }),
  ],
  projects: [
    createProject({
      name: 'Plateforme Big Data temps réel',
      context: 'Projet personnel',
      description:
        "Architecture distribuée de traitement d'événements, de l'ingestion à la visualisation.",
      technologies: ['Kafka', 'Spark', 'Hadoop', 'Docker'],
      results: ["Traitement soutenu de 50 000 événements par seconde sur un cluster de 3 nœuds."],
      startDate: '2023-02',
      endDate: '2023-09',
      repositoryUrl: 'https://github.com/camille-dupont/realtime-platform',
    }),
    createProject({
      name: 'Détection d’anomalies sur séries temporelles',
      context: 'Projet de master',
      description: "Comparaison de modèles de détection d'anomalies sur des mesures industrielles.",
      technologies: ['Python', 'PyTorch', 'Pandas'],
      results: ['Précision de 0,92 sur le jeu de test.'],
      startDate: '2022-01',
      endDate: '2022-06',
    }),
  ],
  skillCategories: [
    createSkillCategory({
      name: 'Programmation',
      skills: [
        createSkill({ name: 'Python', level: 5 }),
        createSkill({ name: 'SQL', level: 5 }),
        createSkill({ name: 'Java', level: 3 }),
        createSkill({ name: 'TypeScript', level: 3 }),
      ],
    }),
    createSkillCategory({
      name: 'Big Data',
      skills: [
        createSkill({ name: 'Spark', level: 4 }),
        createSkill({ name: 'Kafka', level: 4 }),
        createSkill({ name: 'Airflow', level: 4 }),
      ],
    }),
    createSkillCategory({
      name: 'Bases de données',
      skills: [createSkill({ name: 'PostgreSQL', level: 4 }), createSkill({ name: 'MongoDB', level: 3 })],
    }),
    createSkillCategory({
      name: 'DevOps',
      skills: [
        createSkill({ name: 'Docker', level: 4 }),
        createSkill({ name: 'Git', level: 5 }),
        createSkill({ name: 'Linux', level: 4 }),
      ],
    }),
  ],
  languages: [
    createLanguage({ name: 'Français', level: 'Langue maternelle' }),
    createLanguage({ name: 'Anglais', level: 'Courant', certification: 'TOEIC 950' }),
  ],
  certifications: [],
  publications: [],
  interests: ['Course à pied', 'Cuisine', 'Vulgarisation scientifique'],
})
