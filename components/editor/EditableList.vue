<script setup lang="ts" generic="T extends { id: string }">
/**
 * Liste éditable générique : accordéon, réordonnancement et suppression.
 * Toutes les sections du profil s'appuient dessus — le formulaire de chaque
 * entrée est fourni par le slot par défaut.
 */
const props = defineProps<{ items: T[]; addLabel: string; empty: string }>()

const emit = defineEmits<{ add: []; remove: [id: string]; move: [id: string, offset: number] }>()

const openId = ref<string | null>(null)

// Une entrée qui vient d'être ajoutée s'ouvre d'elle-même.
watch(
  () => props.items.length,
  (length, previous) => {
    if (length > previous) openId.value = props.items[length - 1]?.id ?? null
  },
)

const toggle = (id: string) => (openId.value = openId.value === id ? null : id)

function confirmRemove(id: string) {
  if (confirm('Supprimer cette entrée ?')) emit('remove', id)
}
</script>

<template>
  <div class="space-y-3">
    <TransitionGroup name="list" tag="ul" class="relative space-y-2">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="overflow-hidden rounded-lg border border-line bg-surface transition-shadow duration-200 hover:shadow-sm"
      >
        <div class="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-3 rounded-md px-1 py-1 text-left"
            :aria-expanded="openId === item.id"
            @click="toggle(item.id)"
          >
            <BaseIcon
              name="chevron"
              :size="16"
              class="text-muted transition-transform duration-200"
              :class="{ 'rotate-180': openId === item.id }"
            />
            <span class="min-w-0 flex-1">
              <slot name="summary" :item="item" :index="index" />
            </span>
          </button>

          <div class="flex items-center">
            <BaseIconButton icon="arrowUp" label="Monter" :disabled="index === 0" @click="emit('move', item.id, -1)" />
            <BaseIconButton
              icon="arrowDown"
              label="Descendre"
              :disabled="index === items.length - 1"
              @click="emit('move', item.id, 1)"
            />
            <BaseIconButton icon="trash" label="Supprimer" danger @click="confirmRemove(item.id)" />
          </div>
        </div>

        <Transition name="collapse">
          <div v-if="openId === item.id">
            <div class="border-t border-line bg-canvas/70 px-4 py-4">
              <slot :item="item" :index="index" />
            </div>
          </div>
        </Transition>
      </li>
    </TransitionGroup>

    <p v-if="!items.length" class="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
      {{ empty }}
    </p>

    <BaseButton size="sm" @click="emit('add')">
      <BaseIcon name="plus" :size="16" />
      {{ addLabel }}
    </BaseButton>
  </div>
</template>
