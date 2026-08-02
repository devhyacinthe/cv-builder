import { z } from 'zod'
import { profileSchema } from '~/schemas/profile'
import { cvLibrarySchema } from '~/schemas/document'
import { letterLibrarySchema } from '~/schemas/letter'

/**
 * Format d'échange de la sauvegarde.
 *
 * Une seule archive contient tout ce que l'application sait de vous : le
 * profil, les CV et les lettres. Relue à travers les mêmes schémas Zod que
 * l'application, elle ne peut pas corrompre l'état — un fichier étranger ou
 * abîmé est refusé plutôt qu'appliqué à moitié.
 */

export const BACKUP_SIGNATURE = 'cv-builder-ats'
export const BACKUP_VERSION = 1

export const backupSchema = z.object({
  application: z.literal(BACKUP_SIGNATURE),
  version: z.number(),
  exportedAt: z.string(),
  profile: profileSchema,
  documents: cvLibrarySchema,
  letters: letterLibrarySchema,
})

export type Backup = z.infer<typeof backupSchema>

/** « cv-builder-2026-08-02.json » : les sauvegardes s'empilent sans s'écraser. */
export const backupFileName = (date = new Date()): string =>
  `cv-builder-${date.toISOString().slice(0, 10)}.json`

export const formatBytes = (bytes: number): string =>
  bytes < 1024 ? `${bytes} o` : `${(bytes / 1024).toFixed(1)} Ko`
