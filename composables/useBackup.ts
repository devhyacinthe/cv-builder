import { BACKUP_SIGNATURE, BACKUP_VERSION, backupFileName, backupSchema, type Backup } from '~/utils/backup'

export interface RestoreResult {
  ok: boolean
  message: string
}

/**
 * Sauvegarde et restauration de l'intégralité des données.
 *
 * Les données ne vivent que dans ce navigateur : ce fichier est le seul moyen
 * de les emporter ailleurs. L'écriture comme la lecture passent par le
 * téléchargement natif du navigateur, sans service tiers.
 */
export function useBackup() {
  const profileStore = useProfileStore()
  const documentStore = useDocumentStore()
  const letterStore = useLetterStore()

  const createBackup = (): Backup => ({
    application: BACKUP_SIGNATURE,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: profileStore.profile,
    documents: documentStore.snapshot,
    letters: letterStore.snapshot,
  })

  function downloadBackup(): void {
    const blob = new Blob([JSON.stringify(createBackup(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = backupFileName()
    link.click()
    URL.revokeObjectURL(url)
  }

  async function restoreBackup(file: File): Promise<RestoreResult> {
    let raw: unknown
    try {
      raw = JSON.parse(await file.text())
    } catch {
      return { ok: false, message: 'Ce fichier n’est pas un JSON lisible.' }
    }

    const parsed = backupSchema.safeParse(raw)
    if (!parsed.success) {
      return { ok: false, message: 'Ce fichier n’est pas une sauvegarde CV Builder valide.' }
    }

    // Tout ou rien : les trois états sont remplacés d'un bloc.
    profileStore.replaceProfile(parsed.data.profile)
    documentStore.replaceLibrary(parsed.data.documents)
    letterStore.replaceLibrary(parsed.data.letters)

    const { documents, letters } = parsed.data
    return {
      ok: true,
      message: `Sauvegarde restaurée : profil, ${documents.documents.length} CV et ${letters.letters.length} lettre(s).`,
    }
  }

  function eraseEverything(): void {
    profileStore.resetProfile()
    documentStore.resetLibrary()
    letterStore.resetLibrary()
  }

  return { createBackup, downloadBackup, restoreBackup, eraseEverything }
}
