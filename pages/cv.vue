<script setup lang="ts">
import { accentPresets, cvTemplates } from '~/constants/cvTemplates'
import { findSection } from '~/constants/profileSections'

definePageMeta({ wide: true })

const profileStore = useProfileStore()
const documentStore = useDocumentStore()

const document = computed(() => documentStore.activeDocument)

/** Deux modes d'édition pour un même aperçu : le fond et la forme. */
const panel = ref<'contenu' | 'forme'>('contenu')
const sectionKey = ref('identite')
const section = computed(() => findSection(sectionKey.value))
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Mes CV</h1>
        <p class="mt-1 text-sm text-muted">
          Modifiez votre contenu à gauche : le CV se met à jour immédiatement à droite.
        </p>
      </div>
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
                <BaseInput
                  :id="id"
                  :model-value="document.name"
                  @update:model-value="documentStore.updateActive({ name: $event })"
                />
              </BaseField>
            </BaseCard>

            <BaseCard title="Modèle">
              <div class="@container">
                <div class="grid gap-3 @md:grid-cols-2">
                <TemplateCard
                  v-for="template in cvTemplates"
                  :key="template.id"
                  :template="template"
                  :profile="profileStore.profile"
                  :accent="document.accent"
                  :selected="template.id === document.templateId"
                  @click="documentStore.updateActive({ templateId: template.id })"
                  :title="template.description"
                />
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
                  @click="documentStore.updateActive({ accent: preset.value })"
                />
              </div>
            </BaseCard>
          </div>
        </Transition>
      </div>

      <div
        class="overflow-hidden rounded-lg border border-line bg-surface xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]"
      >
        <CvPreview :profile="profileStore.profile" :document="document" />
      </div>
    </div>
  </div>
</template>
