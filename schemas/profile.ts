import { z } from 'zod'

/**
 * Modèle de données du profil professionnel.
 *
 * Les schémas Zod sont l'unique source de vérité : les types TypeScript en sont
 * déduits (`z.infer`) afin qu'un champ ne puisse jamais diverger entre la
 * validation et le typage.
 *
 * Règle de tolérance : les chaînes vides sont acceptées partout. L'éditeur
 * enregistre des brouillons en continu ; la vérification de complétude relève
 * de l'analyse ATS, pas de la couche de données.
 */

/** Date au mois près, ex. « 2026-03 ». Vide = non renseignée. */
export const monthDateSchema = z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('')])

const optionalUrl = z.union([z.string().url(), z.literal('')]).catch('')
const optionalEmail = z.union([z.string().email(), z.literal('')]).catch('')

/** Ajoute l'identifiant stable partagé par toutes les entités listées. */
const entity = <T extends z.ZodRawShape>(shape: T) => z.object({ id: z.string().min(1), ...shape })

export const socialPlatforms = ['linkedin', 'github', 'website', 'twitter', 'other'] as const
export const socialLinkSchema = entity({
  platform: z.enum(socialPlatforms).catch('other'),
  label: z.string(),
  url: z.string(),
})

export const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  title: z.string(),
  email: optionalEmail,
  phone: z.string(),
  location: z.string(),
  nationality: z.string(),
  birthDate: z.string(),
  drivingLicence: z.string(),
  /** Photo encodée en data URL, stockée avec le profil. */
  photo: z.string(),
  links: z.array(socialLinkSchema),
})

export const summarySchema = z.object({
  headline: z.string(),
  content: z.string(),
  objective: z.string(),
})

export const experienceSchema = entity({
  company: z.string(),
  position: z.string(),
  location: z.string(),
  startDate: monthDateSchema,
  endDate: monthDateSchema,
  current: z.boolean(),
  description: z.string(),
  /** Puces de réalisations, telles qu'affichées par les templates. */
  highlights: z.array(z.string()),
  technologies: z.array(z.string()),
})

export const educationSchema = entity({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  location: z.string(),
  startDate: monthDateSchema,
  endDate: monthDateSchema,
  current: z.boolean(),
  description: z.string(),
  highlights: z.array(z.string()),
})

export const projectSchema = entity({
  name: z.string(),
  context: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  results: z.array(z.string()),
  startDate: monthDateSchema,
  endDate: monthDateSchema,
  repositoryUrl: optionalUrl,
  demoUrl: optionalUrl,
  documentationUrl: optionalUrl,
})

export const skillSchema = entity({
  name: z.string(),
  /** 1 à 5 : exploité par les templates affichant des barres de niveau. */
  level: z.number().int().min(1).max(5).catch(3),
})

/**
 * Une catégorie regroupe soit des compétences techniques, évaluées par un
 * niveau, soit des compétences transversales (rigueur, esprit d'équipe…) que
 * l'on énumère sans les noter.
 */
export const skillKinds = ['technical', 'soft'] as const

export const skillCategorySchema = entity({
  name: z.string(),
  kind: z.enum(skillKinds).catch('technical'),
  skills: z.array(skillSchema),
})

export const languageSchema = entity({
  name: z.string(),
  level: z.string(),
  certification: z.string(),
})

export const certificationSchema = entity({
  name: z.string(),
  issuer: z.string(),
  date: monthDateSchema,
  url: optionalUrl,
})

export const publicationSchema = entity({
  title: z.string(),
  authors: z.string(),
  venue: z.string(),
  date: monthDateSchema,
  url: optionalUrl,
})

export const profileSchema = z.object({
  personal: personalInfoSchema,
  summary: summarySchema,
  experiences: z.array(experienceSchema),
  educations: z.array(educationSchema),
  projects: z.array(projectSchema),
  skillCategories: z.array(skillCategorySchema),
  languages: z.array(languageSchema),
  certifications: z.array(certificationSchema),
  publications: z.array(publicationSchema),
  /** Centres d'intérêt, affichés par les modèles qui prévoient la rubrique. */
  interests: z.array(z.string()).catch([]),
})

export type SocialPlatform = (typeof socialPlatforms)[number]
export type SocialLink = z.infer<typeof socialLinkSchema>
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Summary = z.infer<typeof summarySchema>
export type Experience = z.infer<typeof experienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Project = z.infer<typeof projectSchema>
export type SkillKind = (typeof skillKinds)[number]
export type Skill = z.infer<typeof skillSchema>
export type SkillCategory = z.infer<typeof skillCategorySchema>
export type Language = z.infer<typeof languageSchema>
export type Certification = z.infer<typeof certificationSchema>
export type Publication = z.infer<typeof publicationSchema>
export type Profile = z.infer<typeof profileSchema>

/** Toute entité listée du profil : socle des utilitaires de liste génériques. */
export type Entity = { id: string }
