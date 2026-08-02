<script setup lang="ts">
import type { CvDocument } from '~/schemas/document'
import { findTemplate } from '~/constants/cvTemplates'
import { documentProfile } from '~/utils/cvDocument'
import { formatStamp } from '~/utils/date'

/** Carte d'un CV de la bibliothèque : aperçu réel du document, et non une image figée. */
const props = defineProps<{ document: CvDocument }>()

defineEmits<{ open: []; duplicate: []; remove: []; download: [] }>()

const profileStore = useProfileStore()

const template = computed(() => findTemplate(props.document.templateId))
const rendered = computed(() => documentProfile(profileStore.profile, props.document))
</script>

<template>
  <DocumentCard
    :title="document.name || 'CV sans nom'"
    :subtitle="`${template.name} · modifié le ${formatStamp(document.updatedAt)}`"
    :exported-at="document.exportedAt"
    @open="$emit('open')"
    @download="$emit('download')"
    @duplicate="$emit('duplicate')"
    @remove="$emit('remove')"
  >
    <component :is="template.component" :profile="rendered" :accent="document.accent" />
  </DocumentCard>
</template>
