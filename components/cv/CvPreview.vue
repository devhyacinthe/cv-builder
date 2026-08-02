<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import type { CvDocument } from '~/schemas/document'
import { findTemplate } from '~/constants/cvTemplates'

/** Aperçu d'un CV : le modèle choisi, rendu dans la feuille de prévisualisation. */
const props = defineProps<{ profile: Profile; document: CvDocument }>()

const template = computed(() => findTemplate(props.document.templateId))
</script>

<template>
  <PaperPreview :label="template.name">
    <component :is="template.component" :profile="profile" :accent="document.accent" />
    <template #actions>
      <slot name="actions" />
    </template>
  </PaperPreview>
</template>
