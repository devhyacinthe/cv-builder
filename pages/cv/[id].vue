<script setup lang="ts">
import { accentPresets, cvTemplates } from '~/constants/cvTemplates'
import { findSection } from '~/constants/profileSections'
import { documentProfile } from '~/utils/cvDocument'

definePageMeta({ wide: true })

const route = useRoute()
const profileStore = useProfileStore()
const documentStore = useDocumentStore()
const { exportCv } = useDocumentExport()

const documentId = computed(() => String(route.params.id))

// L'URL fait foi : ouvrir un CV depuis la bibliothèque le rend courant.
watch(documentId, (id) => documentStore.selectDocument(id), { immediate: true })

const document = computed(() => documentStore.byId(documentId.value) ?? documentStore.activeDocument)
const rendered = computed(() => documentProfile(profileStore.profile, document.value))

/** Deux modes d'édition pour un même aperçu : le fond et la forme. */
const panel = ref<'contenu' | 'forme'>('contenu')
const sectionKey = ref('identite')
const section = computed(() => findSection(sectionKey.value))

const update = (patch: Parameters<typeof documentStore.updateActive>[0]) =>
  documentStore.updateDocument(document.value.id, patch)
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <NuxtLink to="/cv" class="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
          <BaseIcon name="chevron" :size="14" class="rotate-90" />
          Mes CV
        </NuxtLink>
        <h1 class="mt-1 truncate text-xl font-semibold tracking-tight">
          {{ document.name || 'CV sans nom' }}
        </h1>
      </div>
      <BaseButton variant="primary" size="sm" @click="exportCv(document.id)">
        <BaseIcon name="document" :size="16" />
        Télécharger en PDF
      </BaseButton>
    </header>

    <div class="grid gap-5 xl:grid-cols-[minmax(420px,34%)_minmax(0,1fr)]">
      <div class="space-y-4">
        <div class="flex rounded-lg border border-line bg-surface p-1">
          <button
            v-for="tab in [
              { key: 'contenu', label: 'Contenu', icon: 'user' },
              { key: 'forme', label: 'Mise en forme', icon: 'star' },
            ] as const"
            :key="tab.key"
            type="button"
            class="flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm transition-all duration-200"
            :class="panel === tab.key ? 'bg-brand text-white shadow-sm' : 'text-muted hover:text-ink'"
            @click="panel = tab.key"
          >
            <BaseIcon :name="tab.icon" :size="16" />
            {{ tab.label }}
          </button>
        </div>

        <Transition name="slide" mode="out-in">
          <div v-if="panel === 'contenu'" key="contenu" class="space-y-4">
            <SectionTabs v-model="sectionKey" compact />
            <Transition name="fade" mode="out-in">
              <component :is="section.component" :key="section.key" />
            </Transition>
          </div>

          <div v-else key="forme" class="space-y-4">
            <BaseCard title="Document">
              <BaseField v-slot="{ id }" label="Nom du CV" hint="Ex. : CV Data Engineer">
                <BaseInput :id="id" :model-value="document.name" @update:model-value="update({ name: $event })" />
              </BaseField>
            </BaseCard>

            <BaseCard title="Modèle">
              <div class="@container">
                <div class="grid gap-3 @md:grid-cols-2">
                  <TemplateCard
                    v-for="template in cvTemplates"
                    :key="template.id"
                    :name="template.name"
                    :hint="`Compatibilité ATS ${template.atsSafety}`"
                    :selected="template.id === document.templateId"
                    :title="template.description"
                    @click="update({ templateId: template.id })"
                  >
                    <component :is="template.component" :profile="rendered" :accent="document.accent" />
                  </TemplateCard>
                </div>
              </div>
            </BaseCard>

            <BaseCard title="Couleur d'accent">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="preset in accentPresets"
                  :key="preset.value"
                  type="button"
                  :title="preset.label"
                  :aria-label="preset.label"
                  class="h-8 w-8 rounded-full transition-all duration-200 hover:scale-110"
                  :class="document.accent === preset.value ? 'ring-2 ring-brand ring-offset-2' : 'ring-1 ring-line'"
                  :style="{ backgroundColor: preset.value }"
                  @click="update({ accent: preset.value })"
                />
              </div>
            </BaseCard>

            <DocumentVisibility :document="document" @update="update" />
          </div>
        </Transition>
      </div>

      <!-- Hors grand écran, l'aperçu passe sous le formulaire : il lui faut sa propre hauteur. -->
      <div
        class="h-[70vh] overflow-hidden rounded-lg border border-line bg-surface xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]"
      >
        <CvPreview :profile="rendered" :document="document">
          <template #actions>
            <BaseIconButton icon="document" label="Télécharger en PDF" @click="exportCv(document.id)" />
          </template>
        </CvPreview>
      </div>
    </div>
  </div>
</template>
