<script setup lang="ts">
import type { CvDocument } from '~/schemas/document'
import { documentSections, hideableEntries } from '~/utils/cvDocument'

/**
 * Choix des rubriques et des entrées affichées par ce CV.
 * Rien n'est supprimé du profil : un CV ciblé ne montre qu'une partie.
 */
const props = defineProps<{ document: CvDocument }>()

const emit = defineEmits<{ update: [patch: Partial<CvDocument>] }>()

const { profile } = storeToRefs(useProfileStore())

const groups = computed(() => hideableEntries(profile.value))

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

const isSectionVisible = (key: string) => !props.document.hiddenSections.includes(key)
const isEntryVisible = (id: string) => !props.document.hiddenIds.includes(id)

const toggleSection = (key: string) =>
  emit('update', { hiddenSections: toggle(props.document.hiddenSections, key) })

const toggleEntry = (id: string) => emit('update', { hiddenIds: toggle(props.document.hiddenIds, id) })
</script>

<template>
  <BaseCard title="Rubriques affichées" description="Adaptez ce CV à une candidature précise.">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="section in documentSections"
          :key="section.key"
          type="button"
          class="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition-all duration-200"
          :class="
            isSectionVisible(section.key)
              ? 'border-brand/30 bg-brand-soft text-brand'
              : 'border-line bg-surface text-muted/60 line-through'
          "
          @click="toggleSection(section.key)"
        >
          <BaseIcon :name="isSectionVisible(section.key) ? 'check' : 'close'" :size="12" />
          {{ section.label }}
        </button>
      </div>

      <div v-for="group in groups" :key="group.section" class="space-y-1.5">
        <p class="text-xs font-medium text-muted">{{ group.label }}</p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            class="max-w-full truncate rounded-md border px-2 py-1 text-xs transition-all duration-200"
            :class="
              isEntryVisible(item.id)
                ? 'border-line bg-surface text-ink hover:border-brand/40'
                : 'border-dashed border-line bg-canvas text-muted/60 line-through'
            "
            @click="toggleEntry(item.id)"
          >
            {{ item.label || 'Sans titre' }}
          </button>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
