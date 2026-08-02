<script setup lang="ts">
import type { Letter } from '~/schemas/letter'
import { findLetterTemplate } from '~/constants/letterTemplates'
import { formatStamp } from '~/utils/date'

/** Carte d'une lettre de la bibliothèque : aperçu réel du document. */
const props = defineProps<{ letter: Letter }>()

defineEmits<{ open: []; duplicate: []; remove: []; download: [] }>()

const { profile } = storeToRefs(useProfileStore())
const template = computed(() => findLetterTemplate(props.letter.templateId))

const subtitle = computed(() =>
  [props.letter.recipient.company || template.value.name, `modifiée le ${formatStamp(props.letter.updatedAt)}`].join(
    ' · ',
  ),
)
</script>

<template>
  <DocumentCard
    :title="letter.name || 'Lettre sans nom'"
    :subtitle="subtitle"
    :exported-at="letter.exportedAt"
    @open="$emit('open')"
    @download="$emit('download')"
    @duplicate="$emit('duplicate')"
    @remove="$emit('remove')"
  >
    <component :is="template.component" :letter="letter" :profile="profile" :accent="letter.accent" />
  </DocumentCard>
</template>
