import { defineStore } from 'pinia'
import { cvLibrarySchema, type CvDocument, type CvLibrary } from '~/schemas/document'
import { createCvDocument } from '~/utils/factories'
import { findById, removeById } from '~/utils/collection'

const createLibrary = (): CvLibrary => {
  const first = createCvDocument()
  return { documents: [first], activeId: first.id }
}

/**
 * Bibliothèque de CV. Chaque document choisit son modèle, ses réglages et les
 * rubriques qu'il affiche ; le contenu provient toujours du profil unique.
 */
export const useDocumentStore = defineStore('documents', () => {
  const library = ref<CvLibrary>(createLibrary())
  usePersistedState('documents', library, cvLibrarySchema)

  // Une bibliothèque vide n'a pas de sens : il existe toujours un CV courant.
  if (!library.value.documents.length) library.value = createLibrary()

  /** Du plus récemment modifié au plus ancien : l'ordre de l'historique. */
  const documents = computed(() =>
    [...library.value.documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  )

  const activeDocument = computed<CvDocument>(
    () => findById(library.value.documents, library.value.activeId) ?? library.value.documents[0]!,
  )

  const byId = (id: string) => findById(library.value.documents, id)

  function updateDocument(id: string, patch: Partial<Omit<CvDocument, 'id'>>): void {
    const document = byId(id)
    if (document) Object.assign(document, patch, { updatedAt: new Date().toISOString() })
  }

  const updateActive = (patch: Partial<Omit<CvDocument, 'id'>>) => updateDocument(library.value.activeId, patch)

  function addDocument(patch: Partial<CvDocument> = {}): CvDocument {
    const document = createCvDocument(patch)
    library.value.documents.push(document)
    library.value.activeId = document.id
    return document
  }

  function duplicateDocument(id: string): CvDocument | undefined {
    const source = byId(id)
    if (!source) return
    // La copie repart avec sa propre identité et son propre historique.
    const { id: _id, createdAt: _createdAt, exportedAt: _exportedAt, ...settings } = source
    return addDocument({ ...settings, name: `${source.name} (copie)` })
  }

  function removeDocument(id: string): void {
    removeById(library.value.documents, id)
    if (!library.value.documents.length) library.value = createLibrary()
    if (!byId(library.value.activeId)) library.value.activeId = library.value.documents[0]!.id
  }

  /** Trace la date de téléchargement, affichée dans l'historique. */
  function markExported(id: string): void {
    const document = byId(id)
    if (document) document.exportedAt = new Date().toISOString()
  }

  const selectDocument = (id: string) => (library.value.activeId = id)

  /** Bibliothèque brute : sauvegarde et restauration intégrales. */
  const snapshot = computed(() => library.value)
  const replaceLibrary = (next: CvLibrary) => (library.value = cvLibrarySchema.parse(next))
  const resetLibrary = () => (library.value = createLibrary())

  return {
    documents,
    snapshot,
    replaceLibrary,
    resetLibrary,
    activeDocument,
    byId,
    addDocument,
    duplicateDocument,
    removeDocument,
    updateDocument,
    updateActive,
    markExported,
    selectDocument,
  }
})
