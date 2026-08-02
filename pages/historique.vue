<script setup lang="ts">
import { findTemplate } from '~/constants/cvTemplates'

/**
 * Historique de tous les documents produits. Rien n'est archivé au sens
 * classique : un document est reconstruit à l'identique depuis ses réglages,
 * il reste donc téléchargeable indéfiniment.
 */
const documentStore = useDocumentStore()
const { documents } = storeToRefs(documentStore)
const { exportCv } = useCvExport()

const formatDate = (value: string) =>
  value ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'

const entries = computed(() =>
  documents.value.map((document) => ({
    id: document.id,
    name: document.name || 'CV sans nom',
    kind: 'CV',
    template: findTemplate(document.templateId).name,
    updatedAt: document.updatedAt,
    exportedAt: document.exportedAt,
  })),
)
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-xl font-semibold tracking-tight">Historique</h1>
      <p class="mt-1 text-sm text-muted">
        Tous vos documents, retéléchargeables à tout moment sans les refaire.
      </p>
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
          <tbody>
            <tr
              v-for="entry in entries"
              :key="entry.id"
              class="border-b border-line/70 transition-colors last:border-0 hover:bg-canvas"
            >
              <td class="px-5 py-3">
                <NuxtLink :to="`/cv/${entry.id}`" class="font-medium transition-colors hover:text-brand">
                  {{ entry.name }}
                </NuxtLink>
              </td>
              <td class="px-5 py-3">
                <span class="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">{{ entry.kind }}</span>
              </td>
              <td class="px-5 py-3 text-muted">{{ entry.template }}</td>
              <td class="px-5 py-3 text-muted">{{ formatDate(entry.updatedAt) }}</td>
              <td class="px-5 py-3" :class="entry.exportedAt ? 'text-success' : 'text-muted'">
                {{ formatDate(entry.exportedAt) }}
              </td>
              <td class="px-5 py-3 text-right">
                <BaseButton size="sm" @click="exportCv(entry.id)">
                  <BaseIcon name="document" :size="14" />
                  Télécharger
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <p class="text-xs text-muted">
      Les lettres de motivation rejoindront cet historique dès que le module sera en place.
    </p>
  </div>
</template>
