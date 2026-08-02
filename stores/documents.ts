import { defineStore } from 'pinia'
import { cvLibrarySchema, type CvDocument, type CvLibrary } from '~/schemas/document'
import { createCvDocument } from '~/utils/factories'
import { findById } from '~/utils/collection'

const createLibrary = (): CvLibrary => {
  const first = createCvDocument()
  return { documents: [first], activeId: first.id }
}

/**
 * Bibliothèque de CV. Chaque document choisit son modèle et ses réglages ;
 * le contenu provient toujours du profil unique.
 */
export const useDocumentStore = defineStore('documents', () => {
  const library = ref<CvLibrary>(createLibrary())
  usePersistedState('documents', library, cvLibrarySchema)

  // Une bibliothèque vide n'a pas de sens : il existe toujours un CV courant.
  if (!library.value.documents.length) library.value = createLibrary()

  const documents = computed(() => library.value.documents)

  const activeDocument = computed<CvDocument>(
    () => findById(library.value.documents, library.value.activeId) ?? library.value.documents[0]!,
  )

  /** Toute modification d'un document met à jour sa date de dernière édition. */
  function updateActive(patch: Partial<Omit<CvDocument, 'id'>>): void {
    Object.assign(activeDocument.value, patch, { updatedAt: new Date().toISOString() })
  }

  const selectDocument = (id: string) => (library.value.activeId = id)

  return { documents, activeDocument, updateActive, selectDocument }
})
