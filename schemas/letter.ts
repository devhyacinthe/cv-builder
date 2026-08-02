import { z } from 'zod'

/**
 * Modèle de données d'une lettre de motivation.
 *
 * Une lettre ne recopie jamais le profil : elle y puise ses coordonnées et son
 * identité, et ne stocke que ce qui lui est propre — le destinataire, l'objet
 * et son argumentaire.
 */

/** Blocs du corps de la lettre, dans l'ordre de lecture. */
export const letterBlocks = [
  {
    key: 'introduction',
    label: 'Introduction',
    hint: 'Le poste visé et la raison principale de votre candidature.',
  },
  {
    key: 'profile',
    label: 'Présentation du profil',
    hint: 'Formation, expériences marquantes, domaines d’expertise.',
  },
  {
    key: 'skills',
    label: 'Expériences et compétences',
    hint: 'Projets pertinents, réalisations, résultats obtenus.',
  },
  {
    key: 'motivation',
    label: 'Motivation pour l’entreprise',
    hint: 'Pourquoi cette entreprise, ce poste, ce domaine.',
  },
  {
    key: 'conclusion',
    label: 'Conclusion',
    hint: 'Disponibilité et demande d’entretien.',
  },
] as const

export type LetterBlockKey = (typeof letterBlocks)[number]['key']

export const letterBodySchema = z.object({
  introduction: z.string().catch(''),
  profile: z.string().catch(''),
  skills: z.string().catch(''),
  motivation: z.string().catch(''),
  conclusion: z.string().catch(''),
})

export const letterRecipientSchema = z.object({
  company: z.string().catch(''),
  /** Nom du recruteur, facultatif : il change la formule d'appel. */
  contact: z.string().catch(''),
  address: z.string().catch(''),
  city: z.string().catch(''),
})

export const letterSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  templateId: z.string().catch('classic'),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .catch('#1e3a5f'),
  /** CV auquel la lettre est rattachée : contexte de candidature, jamais du contenu. */
  cvId: z.string().catch(''),
  recipient: letterRecipientSchema,
  position: z.string().catch(''),
  /** Référence de l'annonce, reprise sous l'objet. */
  reference: z.string().catch(''),
  /** Objet ; laissé vide, il est composé à partir du poste visé. */
  subject: z.string().catch(''),
  /** Lieu de rédaction, affiché avant la date. */
  place: z.string().catch(''),
  /** Date de rédaction (« 2026-08-02 ») ; vide = date du jour. */
  date: z.string().catch(''),
  salutation: z.string().catch('Madame, Monsieur,'),
  body: letterBodySchema,
  closing: z.string().catch(''),
  createdAt: z.string().catch(''),
  updatedAt: z.string(),
  /** Date du dernier export : nourrit l'historique de téléchargement. */
  exportedAt: z.string().catch(''),
})

export const letterLibrarySchema = z.object({
  letters: z.array(letterSchema),
  activeId: z.string(),
})

export type LetterBody = z.infer<typeof letterBodySchema>
export type LetterRecipient = z.infer<typeof letterRecipientSchema>
export type Letter = z.infer<typeof letterSchema>
export type LetterLibrary = z.infer<typeof letterLibrarySchema>
