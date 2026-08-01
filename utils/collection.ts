import type { Entity } from '~/schemas/profile'

/** Déplace un élément, en ignorant les positions hors bornes. */
export function moveItem<T>(list: T[], from: number, to: number): void {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return
  const [item] = list.splice(from, 1)
  list.splice(to, 0, item as T)
}

export function moveById<T extends Entity>(list: T[], id: string, offset: number): void {
  const index = list.findIndex((item) => item.id === id)
  if (index !== -1) moveItem(list, index, index + offset)
}

export function removeById<T extends Entity>(list: T[], id: string): void {
  const index = list.findIndex((item) => item.id === id)
  if (index !== -1) list.splice(index, 1)
}

export function findById<T extends Entity>(list: T[], id: string): T | undefined {
  return list.find((item) => item.id === id)
}
