import type { Ref } from 'vue'
import type { ZodType } from 'zod'
import { debounce } from '~/utils/debounce'
import { readState, writeState } from '~/utils/storage'

const SAVE_DELAY = 300

/**
 * Branche un état réactif sur le stockage local : hydratation immédiate puis
 * enregistrement différé à chaque modification. Utilisé par les stores Pinia,
 * qui restent ainsi ignorants du mécanisme de persistance.
 */
export function usePersistedState<T>(key: string, state: Ref<T>, schema: ZodType<T>): void {
  const restored = readState(key, schema)
  if (restored) state.value = restored

  const save = debounce((value: T) => writeState(key, value), SAVE_DELAY)
  watch(state, (value) => save(value), { deep: true })
}
