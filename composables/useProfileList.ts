import type { Profile } from '~/schemas/profile'
import type { ProfileListKey } from '~/stores/profile'

/**
 * Câblage d'une section listée du profil sur le store : les composants de
 * section n'écrivent plus que leurs champs de formulaire.
 */
export function useProfileList<K extends ProfileListKey>(key: K, factory: () => Profile[K][number]) {
  const store = useProfileStore()

  return {
    items: computed(() => store.profile[key]),
    add: () => store.addItem(key, factory()),
    remove: (id: string) => store.removeItem(key, id),
    move: (id: string, offset: number) => store.moveItem(key, id, offset),
  }
}
