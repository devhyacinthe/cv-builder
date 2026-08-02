<script setup lang="ts">
/**
 * Vignette d'un modèle : le document réel, rendu en miniature.
 * L'aperçu est donc toujours exact, quel que soit le type de document.
 */
defineProps<{ name: string; hint: string; selected: boolean }>()
</script>

<template>
  <button
    type="button"
    class="group w-full rounded-lg border bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
    :class="selected ? 'border-brand ring-2 ring-brand/20' : 'border-line hover:border-brand/40'"
  >
    <PaperThumb :width="180" class="mx-auto">
      <slot />
    </PaperThumb>

    <div class="mt-3 flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="truncate text-sm font-medium">{{ name }}</p>
        <p class="mt-0.5 text-xs text-muted">{{ hint }}</p>
      </div>
      <span
        class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-200"
        :class="selected ? 'bg-brand text-white' : 'bg-canvas text-transparent group-hover:text-muted'"
      >
        <BaseIcon name="check" :size="12" />
      </span>
    </div>
  </button>
</template>
