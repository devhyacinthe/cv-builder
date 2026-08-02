<script setup lang="ts">
import { formatStamp } from '~/utils/date'

/**
 * Carte d'un document enregistré : sa miniature réelle et ses actions.
 * Commune aux CV et aux lettres — seul le contenu de la miniature change.
 */
defineProps<{ title: string; subtitle: string; exportedAt: string }>()

const emit = defineEmits<{ open: []; duplicate: []; remove: []; download: [] }>()
</script>

<template>
  <article
    class="group overflow-hidden rounded-lg border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <button type="button" class="block w-full cursor-pointer bg-canvas p-4" @click="emit('open')">
      <PaperThumb class="mx-auto">
        <slot />
      </PaperThumb>
    </button>

    <div class="border-t border-line p-4">
      <h3 class="truncate text-sm font-semibold">{{ title }}</h3>
      <p class="mt-0.5 truncate text-xs text-muted">{{ subtitle }}</p>
      <p v-if="exportedAt" class="mt-0.5 text-xs text-success">
        Téléchargé le {{ formatStamp(exportedAt) }}
      </p>

      <div class="mt-3 flex items-center gap-2">
        <BaseButton size="sm" variant="primary" class="flex-1" @click="emit('download')">
          <BaseIcon name="document" :size="14" />
          Télécharger
        </BaseButton>
        <BaseIconButton icon="plus" label="Dupliquer" @click="emit('duplicate')" />
        <BaseIconButton icon="trash" label="Supprimer" danger @click="emit('remove')" />
      </div>
    </div>
  </article>
</template>
