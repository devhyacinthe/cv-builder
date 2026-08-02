import { defineStore } from 'pinia'
import { letterLibrarySchema, type Letter, type LetterLibrary } from '~/schemas/letter'
import { createLetter } from '~/utils/factories'
import { findById, removeById } from '~/utils/collection'

const createLibrary = (): LetterLibrary => {
  const first = createLetter()
  return { letters: [first], activeId: first.id }
}

/**
 * Bibliothèque de lettres de motivation. Même principe que les CV : chaque
 * lettre est indépendante, choisit son modèle, et reste régénérable à l'infini.
 */
export const useLetterStore = defineStore('letters', () => {
  const library = ref<LetterLibrary>(createLibrary())
  usePersistedState('letters', library, letterLibrarySchema)

  if (!library.value.letters.length) library.value = createLibrary()

  /** Du plus récemment modifié au plus ancien : l'ordre de l'historique. */
  const letters = computed(() =>
    [...library.value.letters].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  )

  const activeLetter = computed<Letter>(
    () => findById(library.value.letters, library.value.activeId) ?? library.value.letters[0]!,
  )

  const byId = (id: string) => findById(library.value.letters, id)

  function updateLetter(id: string, patch: Partial<Omit<Letter, 'id'>>): void {
    const letter = byId(id)
    if (letter) Object.assign(letter, patch, { updatedAt: new Date().toISOString() })
  }

  function addLetter(patch: Partial<Letter> = {}): Letter {
    const letter = createLetter(patch)
    library.value.letters.push(letter)
    library.value.activeId = letter.id
    return letter
  }

  function duplicateLetter(id: string): Letter | undefined {
    const source = byId(id)
    if (!source) return
    // La copie repart avec sa propre identité et son propre historique.
    const { id: _id, createdAt: _createdAt, exportedAt: _exportedAt, ...content } = source
    return addLetter({
      ...content,
      recipient: { ...source.recipient },
      body: { ...source.body },
      name: `${source.name} (copie)`,
    })
  }

  function removeLetter(id: string): void {
    removeById(library.value.letters, id)
    if (!library.value.letters.length) library.value = createLibrary()
    if (!byId(library.value.activeId)) library.value.activeId = library.value.letters[0]!.id
  }

  function markExported(id: string): void {
    const letter = byId(id)
    if (letter) letter.exportedAt = new Date().toISOString()
  }

  const selectLetter = (id: string) => (library.value.activeId = id)

  /** Bibliothèque brute : sauvegarde et restauration intégrales. */
  const snapshot = computed(() => library.value)
  const replaceLibrary = (next: LetterLibrary) => (library.value = letterLibrarySchema.parse(next))
  const resetLibrary = () => (library.value = createLibrary())

  return {
    letters,
    snapshot,
    replaceLibrary,
    resetLibrary,
    activeLetter,
    byId,
    addLetter,
    duplicateLetter,
    removeLetter,
    updateLetter,
    markExported,
    selectLetter,
  }
})
