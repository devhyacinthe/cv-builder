<script setup lang="ts">
import type { CvDocument } from '~/schemas/document'
import { findTemplate } from '~/constants/cvTemplates'
import { documentProfile } from '~/utils/cvDocument'

/** Carte d'un CV enregistré : aperçu réel du document, et non une image figée. */
const props = defineProps<{ document: CvDocument }>()

const emit = defineEmits<{ open: []; duplicate: []; remove: []; download: [] }>()

const profileStore = useProfileStore()

const template = computed(() => findTemplate(props.document.templateId))
const rendered = computed(() => documentProfile(profileStore.profile, props.document))

// 200 px de large pour une feuille A4 de 793,7 px.
const THUMBNAIL_SCALE = 0.252

const formatDate = (value: string) =>
  value ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value)) : ''
</script>

<template>
  <article class="group overflow-hidden rounded-lg border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <button type="button" class="block w-full cursor-pointer bg-canvas p-4" @click="emit('open')">
      <span class="thumb mx-auto block" aria-hidden="true">
        <span class="thumb-inner" :style="{ transform: `scale(${THUMBNAIL_SCALE})` }">
          <component :is="template.component" :profile="rendered" :accent="document.accent" />
        </span>
      </span>
    </button>

    <div class="border-t border-line p-4">
      <h3 class="truncate text-sm font-semibold">{{ document.name || 'CV sans nom' }}</h3>
      <p class="mt-0.5 text-xs text-muted">
        {{ template.name }} · modifié le {{ formatDate(document.updatedAt) }}
      </p>
      <p v-if="document.exportedAt" class="mt-0.5 text-xs text-success">
        Téléchargé le {{ formatDate(document.exportedAt) }}
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

<style scoped>
.thumb {
  position: relative;
  width: 200px;
  height: 283px; /* 297 mm × échelle */
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
