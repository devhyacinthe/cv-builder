<script setup lang="ts">
import { findTemplate } from '~/constants/cvTemplates'
import { findLetterTemplate } from '~/constants/letterTemplates'
import { formatStamp } from '~/utils/date'

/**
 * Historique de tous les documents produits. Rien n'est archivé au sens
 * classique : un document est reconstruit à l'identique depuis ses réglages,
 * il reste donc téléchargeable indéfiniment.
 */
const { documents } = storeToRefs(useDocumentStore())
const { letters } = storeToRefs(useLetterStore())
const { exportCv, exportLetter } = useDocumentExport()

type Kind = 'cv' | 'lettre'

const filters = [
  { key: 'tous', label: 'Tous' },
  { key: 'cv', label: 'CV' },
  { key: 'lettre', label: 'Lettres' },
] as const

const filter = ref<(typeof filters)[number]['key']>('tous')

const entries = computed(() =>
  [
    ...documents.value.map((document) => ({
      id: document.id,
      kind: 'cv' as Kind,
      label: 'CV',
      name: document.name || 'CV sans nom',
      to: `/cv/${document.id}`,
      template: findTemplate(document.templateId).name,
      updatedAt: document.updatedAt,
      exportedAt: document.exportedAt,
    })),
    ...letters.value.map((letter) => ({
      id: letter.id,
      kind: 'lettre' as Kind,
      label: 'Lettre',
      name: letter.name || 'Lettre sans nom',
      to: `/lettres/${letter.id}`,
      template: findLetterTemplate(letter.templateId).name,
      updatedAt: letter.updatedAt,
      exportedAt: letter.exportedAt,
    })),
  ]
    .filter((entry) => filter.value === 'tous' || entry.kind === filter.value)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
)

const download = (entry: { kind: Kind; id: string }) =>
  entry.kind === 'cv' ? exportCv(entry.id) : exportLetter(entry.id)
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Historique</h1>
        <p class="mt-1 text-sm text-muted">
          Tous vos documents, retéléchargeables à tout moment sans les refaire.
        </p>
      </div>

      <div class="flex rounded-lg border border-line bg-surface p-1">
        <button
          v-for="item in filters"
          :key="item.key"
          type="button"
          class="rounded-md px-3 py-1.5 text-xs transition-all duration-200"
          :class="filter === item.key ? 'bg-brand text-white shadow-sm' : 'text-muted hover:text-ink'"
          @click="filter = item.key"
        >
          {{ item.label }}
        </button>
      </div>
    </header>

    <BaseCard>
      <div class="-mx-5 -my-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-line text-left text-xs text-muted">
              <th class="px-5 py-3 font-medium">Document</th>
              <th class="px-5 py-3 font-medium">Type</th>
              <th class="px-5 py-3 font-medium">Modèle</th>
              <th class="px-5 py-3 font-medium">Modifié</th>
              <th class="px-5 py-3 font-medium">Dernier téléchargement</th>
              <th class="px-5 py-3" />
            </tr>
          </thead>
          <TransitionGroup tag="tbody" name="list">
            <tr
              v-for="entry in entries"
              :key="entry.kind + entry.id"
              class="border-b border-line/70 transition-colors last:border-0 hover:bg-canvas"
            >
              <td class="px-5 py-3">
                <NuxtLink :to="entry.to" class="font-medium transition-colors hover:text-brand">
                  {{ entry.name }}
                </NuxtLink>
              </td>
              <td class="px-5 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="entry.kind === 'cv' ? 'bg-brand-soft text-brand' : 'bg-success/10 text-success'"
                >
                  {{ entry.label }}
                </span>
              </td>
              <td class="px-5 py-3 text-muted">{{ entry.template }}</td>
              <td class="px-5 py-3 text-muted">{{ formatStamp(entry.updatedAt, true) }}</td>
              <td class="px-5 py-3" :class="entry.exportedAt ? 'text-success' : 'text-muted'">
                {{ formatStamp(entry.exportedAt, true) || '—' }}
              </td>
              <td class="px-5 py-3 text-right">
                <BaseButton size="sm" @click="download(entry)">
                  <BaseIcon name="document" :size="14" />
                  Télécharger
                </BaseButton>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
