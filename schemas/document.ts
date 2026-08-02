import { z } from 'zod'

/**
 * Document CV : une combinaison « profil + template + réglages ».
 * Les données professionnelles n'y sont jamais recopiées — un document ne
 * décrit que la façon de les présenter, et ce qu'il en masque.
 */
export const cvDocumentSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  templateId: z.string(),
  /** Couleur d'accent du modèle, au format hexadécimal. */
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .catch('#1e3a5f'),
  createdAt: z.string().catch(''),
  updatedAt: z.string(),
  /** Date du dernier export : nourrit l'historique de téléchargement. */
  exportedAt: z.string().catch(''),
  /** Entrées du profil masquées dans ce CV précis. */
  hiddenIds: z.array(z.string()).catch([]),
  /** Rubriques entièrement masquées dans ce CV. */
  hiddenSections: z.array(z.string()).catch([]),
})

export const cvLibrarySchema = z.object({
  documents: z.array(cvDocumentSchema),
  activeId: z.string(),
})

export type CvDocument = z.infer<typeof cvDocumentSchema>
export type CvLibrary = z.infer<typeof cvLibrarySchema>
