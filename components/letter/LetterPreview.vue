<script setup lang="ts">
import type { Letter } from '~/schemas/letter'
import { findLetterTemplate } from '~/constants/letterTemplates'

/** Aperçu d'une lettre : le modèle choisi, rendu dans la feuille de prévisualisation. */
const props = defineProps<{ letter: Letter }>()

const { profile } = storeToRefs(useProfileStore())
const template = computed(() => findLetterTemplate(props.letter.templateId))
</script>

<template>
  <PaperPreview :label="template.name">
    <component :is="template.component" :letter="letter" :profile="profile" :accent="letter.accent" />
    <template #actions>
      <slot name="actions" />
    </template>
  </PaperPreview>
</template>
