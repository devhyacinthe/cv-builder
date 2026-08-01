import { defineStore } from 'pinia'
import { profileSchema, type Entity, type Profile } from '~/schemas/profile'
import { createProfile } from '~/utils/factories'
import { moveById, removeById } from '~/utils/collection'

/** Sections du profil gérées comme des listes ordonnées d'entités. */
export type ProfileListKey =
  | 'experiences'
  | 'educations'
  | 'projects'
  | 'skillCategories'
  | 'languages'
  | 'certifications'
  | 'publications'

type ItemOf<K extends ProfileListKey> = Profile[K][number]

/**
 * Source unique des données professionnelles. Tous les CV et lettres s'y
 * réfèrent : une information n'est saisie qu'une seule fois.
 */
export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>(createProfile())
  usePersistedState('profile', profile, profileSchema)

  const fullName = computed(() =>
    [profile.value.personal.firstName, profile.value.personal.lastName].filter(Boolean).join(' '),
  )

  const isEmpty = computed(
    () => !fullName.value && !profile.value.experiences.length && !profile.value.educations.length,
  )

  const listOf = <K extends ProfileListKey>(key: K) => profile.value[key] as unknown as Entity[]

  function addItem<K extends ProfileListKey>(key: K, item: ItemOf<K>): ItemOf<K> {
    listOf(key).push(item)
    return item
  }

  function removeItem(key: ProfileListKey, id: string): void {
    removeById(listOf(key), id)
  }

  /** Déplace une entrée de `offset` positions (-1 = vers le haut). */
  function moveItem(key: ProfileListKey, id: string, offset: number): void {
    moveById(listOf(key), id, offset)
  }

  /** Remplace l'intégralité du profil (import de sauvegarde, jeu d'exemple). */
  function replaceProfile(next: Profile): void {
    profile.value = profileSchema.parse(next)
  }

  function resetProfile(): void {
    profile.value = createProfile()
  }

  return { profile, fullName, isEmpty, addItem, removeItem, moveItem, replaceProfile, resetProfile }
})
