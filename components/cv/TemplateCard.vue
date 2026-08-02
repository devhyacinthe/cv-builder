<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import type { CvTemplate } from '~/constants/cvTemplates'

/**
 * Vignette d'un modèle : le document réel, rendu en miniature.
 * L'aperçu est donc toujours exact, sans image à maintenir.
 */
defineProps<{ template: CvTemplate; profile: Profile; accent: string; selected: boolean }>()

// 180 px de large pour une feuille A4 de 793,7 px.
const THUMBNAIL_SCALE = 0.227
</script>

<template>
  <button
    type="button"
    class="group w-full rounded-lg border bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
    :class="selected ? 'border-brand ring-2 ring-brand/20' : 'border-line hover:border-brand/40'"
  >
    <div class="thumb mx-auto" aria-hidden="true">
      <div class="thumb-inner" :style="{ transform: `scale(${THUMBNAIL_SCALE})` }">
        <component :is="template.component" :profile="profile" :accent="accent" />
      </div>
    </div>

    <div class="mt-3 flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="truncate text-sm font-medium">{{ template.name }}</p>
        <p class="mt-0.5 text-xs text-muted">Compatibilité ATS {{ template.atsSafety }}</p>
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

<style scoped>
.thumb {
  position: relative;
  width: 180px;
  height: 254px; /* 297 mm × échelle */
  overflow: hidden;
  border: 1px solid var(--color-line);
  background: #ffffff;
}

.thumb-inner {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  pointer-events: none;
}
</style>
