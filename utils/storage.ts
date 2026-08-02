import type { ZodType } from 'zod'

/**
 * Persistance locale versionnée.
 *
 * Chaque état est enregistré dans une enveloppe `{ version, updatedAt, data }`
 * et relu à travers son schéma Zod : une donnée corrompue ou issue d'une
 * version incompatible est ignorée plutôt que de casser l'application.
 */

const NAMESPACE = 'cv-builder'
const STORAGE_VERSION = 1

interface Envelope<T> {
  version: number
  updatedAt: string
  data: T
}

const storageKey = (key: string) => `${NAMESPACE}:${key}`

const storage = (): Storage | null => (typeof localStorage === 'undefined' ? null : localStorage)

export function readState<T>(key: string, schema: ZodType<T>): T | null {
  const raw = storage()?.getItem(storageKey(key))
  if (!raw) return null
  try {
    const envelope = JSON.parse(raw) as Partial<Envelope<unknown>>
    if (envelope.version !== STORAGE_VERSION) return null
    const parsed = schema.safeParse(envelope.data)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function writeState<T>(key: string, data: T): void {
  const envelope: Envelope<T> = { version: STORAGE_VERSION, updatedAt: new Date().toISOString(), data }
  try {
    storage()?.setItem(storageKey(key), JSON.stringify(envelope))
  } catch {
    // Quota dépassé : on préfère un enregistrement manqué à un crash de l'éditeur.
  }
}

export function clearState(key: string): void {
  storage()?.removeItem(storageKey(key))
}

/** Poids total des données conservées par l'application, en octets. */
export function storedBytes(): number {
  const store = storage()
  if (!store) return 0

  let total = 0
  for (let index = 0; index < store.length; index += 1) {
    const key = store.key(index)
    if (key?.startsWith(`${NAMESPACE}:`)) total += key.length + (store.getItem(key)?.length ?? 0)
  }
  return total
}
