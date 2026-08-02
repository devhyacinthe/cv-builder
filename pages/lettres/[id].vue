<script setup lang="ts">
import { accentPresets } from '~/constants/cvTemplates'
import { closingPresets, letterTemplates, salutationPresets } from '~/constants/letterTemplates'
import { letterBlocks, type Letter, type LetterBlockKey } from '~/schemas/letter'
import { draftBody } from '~/utils/letterDraft'

definePageMeta({ wide: true })

const route = useRoute()
const profileStore = useProfileStore()
const letterStore = useLetterStore()
const documentStore = useDocumentStore()
const { exportLetter } = useDocumentExport()

const letterId = computed(() => String(route.params.id))

// L'URL fait foi : ouvrir une lettre depuis la bibliothèque la rend courante.
watch(letterId, (id) => letterStore.selectLetter(id), { immediate: true })

const letter = computed(() => letterStore.byId(letterId.value) ?? letterStore.activeLetter)

const update = (patch: Partial<Omit<Letter, 'id'>>) => letterStore.updateLetter(letter.value.id, patch)

const updateRecipient = (patch: Partial<Letter['recipient']>) =>
  update({ recipient: { ...letter.value.recipient, ...patch } })

const updateBlock = (key: LetterBlockKey, value: string) =>
  update({ body: { ...letter.value.body, [key]: value } })

/** Deux modes d'édition pour un même aperçu : le fond et la forme. */
const panel = ref<'contenu' | 'forme'>('contenu')

/** CV auquel rattacher la lettre : simple repère de candidature. */
const cvOptions = computed(() => [
  { value: '', label: 'Aucun' },
  ...documentStore.documents.map((document) => ({ value: document.id, label: document.name || 'CV sans nom' })),
])

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

const totalWords = computed(() =>
  letterBlocks.reduce((total, block) => total + countWords(letter.value.body[block.key]), 0),
)

/** Une lettre de candidature se lit en une minute : 250 à 400 mots. */
const lengthHint = computed(() => {
  if (totalWords.value === 0) return 'Le corps est vide.'
  if (totalWords.value < 200) return `${totalWords.value} mots — un peu court, visez 250 à 400 mots.`
  if (totalWords.value > 450) return `${totalWords.value} mots — trop long, une lettre se lit en une minute.`
  return `${totalWords.value} mots — bonne longueur.`
})

function prefill() {
  const written = letterBlocks.some((block) => letter.value.body[block.key].trim())
  if (written && !confirm('Remplacer le contenu actuel par un brouillon composé depuis votre profil ?')) return
  update({ body: draftBody(profileStore.profile, letter.value) })
}
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <NuxtLink
          to="/lettres"
          class="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
        >
          <BaseIcon name="chevron" :size="14" class="rotate-90" />
          Mes lettres
        </NuxtLink>
        <h1 class="mt-1 truncate text-xl font-semibold tracking-tight">
          {{ letter.name || 'Lettre sans nom' }}
        </h1>
      </div>
      <BaseButton variant="primary" size="sm" @click="exportLetter(letter.id)">
        <BaseIcon name="document" :size="16" />
        Télécharger en PDF
      </BaseButton>
    </header>

    <div class="grid gap-5 xl:grid-cols-[minmax(420px,34%)_minmax(0,1fr)]">
      <div class="space-y-4">
        <div class="flex rounded-lg border border-line bg-surface p-1">
          <button
            v-for="tab in [
              { key: 'contenu', label: 'Contenu', icon: 'mail' },
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
            <BaseCard title="Candidature" description="Ce qui compose l'objet de la lettre.">
              <div class="@container">
                <div class="grid gap-4 @md:grid-cols-2">
                  <BaseField v-slot="{ id }" label="Poste visé" hint="Ex. : Data Engineer">
                    <BaseInput
                      :id="id"
                      :model-value="letter.position"
                      @update:model-value="update({ position: $event })"
                    />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="Référence de l'annonce">
                    <BaseInput
                      :id="id"
                      :model-value="letter.reference"
                      @update:model-value="update({ reference: $event })"
                    />
                  </BaseField>
                  <BaseField
                    v-slot="{ id }"
                    label="Objet"
                    hint="Laissé vide, il est composé depuis le poste visé."
                    class="@md:col-span-2"
                  >
                    <BaseInput
                      :id="id"
                      :model-value="letter.subject"
                      @update:model-value="update({ subject: $event })"
                    />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="CV associé" class="@md:col-span-2">
                    <BaseSelect
                      :id="id"
                      :model-value="letter.cvId"
                      :options="cvOptions"
                      @update:model-value="update({ cvId: $event })"
                    />
                  </BaseField>
                </div>
              </div>
            </BaseCard>

            <BaseCard title="Destinataire">
              <div class="@container">
                <div class="grid gap-4 @md:grid-cols-2">
                  <BaseField v-slot="{ id }" label="Entreprise">
                    <BaseInput
                      :id="id"
                      :model-value="letter.recipient.company"
                      @update:model-value="updateRecipient({ company: $event })"
                    />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="Interlocuteur" hint="Facultatif">
                    <BaseInput
                      :id="id"
                      :model-value="letter.recipient.contact"
                      @update:model-value="updateRecipient({ contact: $event })"
                    />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="Adresse">
                    <BaseInput
                      :id="id"
                      :model-value="letter.recipient.address"
                      @update:model-value="updateRecipient({ address: $event })"
                    />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="Code postal et ville">
                    <BaseInput
                      :id="id"
                      :model-value="letter.recipient.city"
                      @update:model-value="updateRecipient({ city: $event })"
                    />
                  </BaseField>
                </div>
              </div>
            </BaseCard>

            <BaseCard title="En-tête">
              <div class="@container">
                <div class="grid gap-4 @md:grid-cols-2">
                  <BaseField v-slot="{ id }" label="Lieu de rédaction">
                    <BaseInput :id="id" :model-value="letter.place" @update:model-value="update({ place: $event })" />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="Date">
                    <BaseInput
                      :id="id"
                      type="date"
                      :model-value="letter.date"
                      @update:model-value="update({ date: $event })"
                    />
                  </BaseField>
                  <BaseField v-slot="{ id }" label="Formule d'appel" class="@md:col-span-2">
                    <BaseInput
                      :id="id"
                      :model-value="letter.salutation"
                      @update:model-value="update({ salutation: $event })"
                    />
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <button
                        v-for="preset in salutationPresets"
                        :key="preset"
                        type="button"
                        class="rounded-full border px-2.5 py-1 text-xs transition-all duration-200"
                        :class="
                          letter.salutation === preset
                            ? 'border-brand/30 bg-brand-soft text-brand'
                            : 'border-line text-muted hover:border-brand/40 hover:text-ink'
                        "
                        @click="update({ salutation: preset })"
                      >
                        {{ preset }}
                      </button>
                    </div>
                  </BaseField>
                </div>
              </div>
            </BaseCard>

            <BaseCard title="Corps de la lettre" :description="lengthHint">
              <template #actions>
                <BaseButton size="sm" @click="prefill">
                  <BaseIcon name="star" :size="14" />
                  Pré-remplir depuis mon profil
                </BaseButton>
              </template>

              <div class="space-y-4">
                <BaseField
                  v-for="block in letterBlocks"
                  :key="block.key"
                  v-slot="{ id }"
                  :label="block.label"
                  :hint="block.hint"
                >
                  <BaseTextarea
                    :id="id"
                    :rows="4"
                    :model-value="letter.body[block.key]"
                    @update:model-value="updateBlock(block.key, $event)"
                  />
                </BaseField>
              </div>
            </BaseCard>

            <BaseCard title="Formule de politesse">
              <BaseTextarea
                :rows="3"
                :model-value="letter.closing"
                @update:model-value="update({ closing: $event })"
              />
              <div class="mt-2 space-y-1">
                <button
                  v-for="preset in closingPresets"
                  :key="preset"
                  type="button"
                  class="block w-full rounded-md border px-3 py-2 text-left text-xs transition-all duration-200"
                  :class="
                    letter.closing === preset
                      ? 'border-brand/30 bg-brand-soft text-brand'
                      : 'border-line text-muted hover:border-brand/40 hover:text-ink'
                  "
                  @click="update({ closing: preset })"
                >
                  {{ preset }}
                </button>
              </div>
            </BaseCard>
          </div>

          <div v-else key="forme" class="space-y-4">
            <BaseCard title="Document">
              <BaseField v-slot="{ id }" label="Nom de la lettre" hint="Ex. : Lettre stage Data Engineer">
                <BaseInput :id="id" :model-value="letter.name" @update:model-value="update({ name: $event })" />
              </BaseField>
            </BaseCard>

            <BaseCard title="Modèle">
              <div class="@container">
                <div class="grid gap-3 @md:grid-cols-2">
                  <TemplateCard
                    v-for="template in letterTemplates"
                    :key="template.id"
                    :name="template.name"
                    :hint="template.tags[0] ?? ''"
                    :selected="template.id === letter.templateId"
                    :title="template.description"
                    @click="update({ templateId: template.id })"
                  >
                    <component
                      :is="template.component"
                      :letter="letter"
                      :profile="profileStore.profile"
                      :accent="letter.accent"
                    />
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
                  :class="letter.accent === preset.value ? 'ring-2 ring-brand ring-offset-2' : 'ring-1 ring-line'"
                  :style="{ backgroundColor: preset.value }"
                  @click="update({ accent: preset.value })"
                />
              </div>
            </BaseCard>
          </div>
        </Transition>
      </div>

      <!-- Hors grand écran, l'aperçu passe sous le formulaire : il lui faut sa propre hauteur. -->
      <div
        class="h-[70vh] overflow-hidden rounded-lg border border-line bg-surface xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]"
      >
        <LetterPreview :letter="letter">
          <template #actions>
            <BaseIconButton icon="document" label="Télécharger en PDF" @click="exportLetter(letter.id)" />
          </template>
        </LetterPreview>
      </div>
    </div>
  </div>
</template>
