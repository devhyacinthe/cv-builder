<script setup lang="ts">
import { findTemplate } from '~/constants/cvTemplates'
import { documentProfile } from '~/utils/cvDocument'
import { axisScore, keywordScore, matchOffer, readabilityChecks, structureChecks } from '~/utils/atsAnalysis'

definePageMeta({ wide: true })

const profileStore = useProfileStore()
const documentStore = useDocumentStore()
const { documents } = storeToRefs(documentStore)

const documentId = ref(documentStore.activeDocument.id)
const document = computed(() => documentStore.byId(documentId.value) ?? documentStore.activeDocument)
const rendered = computed(() => documentProfile(profileStore.profile, document.value))
const template = computed(() => findTemplate(document.value.templateId))

/** L'aperçu rend la feuille : on récupère son verdict « tient sur une page ». */
const fitState = useCvFitReporter()

const offer = ref('')

const structure = computed(() => structureChecks(rendered.value, template.value))
const readability = computed(() => readabilityChecks(rendered.value, fitState.value.overflowing))
const keywords = computed(() => (offer.value.trim() ? matchOffer(rendered.value, offer.value) : []))

const axes = computed(() => {
  const list = [
    { key: 'structure', label: 'Structure', checks: structure.value, score: axisScore(structure.value), weight: 40 },
    { key: 'readability', label: 'Lisibilité', checks: readability.value, score: axisScore(readability.value), weight: 30 },
  ]
  if (keywords.value.length) {
    list.push({ key: 'keywords', label: 'Mots-clés', checks: [], score: keywordScore(keywords.value), weight: 30 })
  }
  return list
})

const globalScore = computed(() => {
  const total = axes.value.reduce((sum, axis) => sum + axis.weight, 0)
  return Math.round(axes.value.reduce((sum, axis) => sum + axis.score * axis.weight, 0) / total)
})

const state = computed(() => {
  if (globalScore.value >= 80) return { color: 'var(--color-status-good)', label: 'Prêt à envoyer' }
  if (globalScore.value >= 55) return { color: 'var(--color-status-warning)', label: 'Perfectible' }
  return { color: 'var(--color-status-critical)', label: 'À retravailler' }
})

const levelStyles = {
  ok: { icon: 'check' as const, classes: 'bg-success/10 text-success' },
  warn: { icon: 'alert' as const, classes: 'bg-[var(--color-status-warning)]/15 text-[#8a6100]' },
  error: { icon: 'close' as const, classes: 'bg-danger/10 text-danger' },
}

const missing = computed(() => keywords.value.filter((match) => !match.present))
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Analyse ATS</h1>
        <p class="mt-1 text-sm text-muted">
          Ce que verra un logiciel de recrutement en lisant votre CV.
        </p>
      </div>
      <BaseField v-if="documents.length > 1" v-slot="{ id }" label="">
        <BaseSelect
          :id="id"
          v-model="documentId"
          :options="documents.map((item) => ({ value: item.id, label: item.name || 'CV sans nom' }))"
        />
      </BaseField>
    </header>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,32%)]">
      <div class="space-y-4">
        <section class="rounded-lg border border-line bg-surface p-6">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="text-xs tracking-wide text-muted uppercase">Score de compatibilité</p>
              <p class="mt-1 text-5xl leading-none font-semibold tracking-tight">
                {{ globalScore }}<span class="text-2xl text-muted">/100</span>
              </p>
            </div>
            <p class="text-sm text-muted">{{ state.label }}</p>
          </div>

          <div
            class="mt-5 h-2.5 w-full overflow-hidden rounded-full"
            :style="{ backgroundColor: `color-mix(in oklab, ${state.color} 18%, white)` }"
          >
            <div
              class="h-full rounded-full transition-[width,background-color] duration-700 ease-soft"
              :style="{ width: `${globalScore}%`, backgroundColor: state.color }"
            />
          </div>

          <dl class="mt-5 grid gap-3 sm:grid-cols-3">
            <div v-for="axis in axes" :key="axis.key" class="rounded-md border border-line px-4 py-3">
              <dt class="text-xs text-muted">{{ axis.label }}</dt>
              <dd class="mt-1 text-lg font-semibold tabular-nums">{{ axis.score }} %</dd>
            </div>
          </dl>
        </section>

        <BaseCard
          v-for="axis in axes.filter((item) => item.checks.length)"
          :key="axis.key"
          :title="axis.label"
          :description="axis.key === 'structure' ? 'Ce qu’un robot doit pouvoir extraire.' : 'Ce qu’un recruteur lira réellement.'"
        >
          <ul class="space-y-2.5">
            <li v-for="item in axis.checks" :key="item.label" class="flex gap-3">
              <span
                class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                :class="levelStyles[item.level].classes"
              >
                <BaseIcon :name="levelStyles[item.level].icon" :size="12" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium">{{ item.label }}</p>
                <p class="text-xs text-muted">{{ item.detail }}</p>
              </div>
            </li>
          </ul>
        </BaseCard>

        <BaseCard title="Mots-clés de l'offre" description="Collez l'annonce : les termes absents de votre CV ressortent.">
          <div class="space-y-4">
            <BaseTextarea v-model="offer" :rows="5" placeholder="Collez ici le texte de l'offre d'emploi…" />

            <Transition name="slide">
              <div v-if="keywords.length" class="space-y-4">
                <div>
                  <p class="mb-2 text-xs font-medium text-muted">
                    Présents dans votre CV ({{ keywords.length - missing.length }}/{{ keywords.length }})
                  </p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="match in keywords.filter((item) => item.present)"
                      :key="match.word"
                      class="rounded-full bg-success/10 px-2.5 py-1 text-xs text-success"
                    >
                      {{ match.word }}
                    </span>
                  </div>
                </div>

                <div v-if="missing.length">
                  <p class="mb-2 text-xs font-medium text-muted">Absents — à intégrer si le terme vous correspond</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="match in missing"
                      :key="match.word"
                      class="rounded-full bg-danger/10 px-2.5 py-1 text-xs text-danger"
                    >
                      {{ match.word }}
                      <span v-if="match.count > 1" class="opacity-60">×{{ match.count }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </BaseCard>
      </div>

      <div class="space-y-4">
        <div class="overflow-hidden rounded-lg border border-line bg-surface xl:sticky xl:top-6">
          <CvPreview :profile="rendered" :document="document" class="h-[70vh]" />
        </div>
        <BaseButton size="sm" :to="`/cv/${document.id}`" class="w-full">
          <BaseIcon name="user" :size="16" />
          Corriger ce CV
        </BaseButton>
      </div>
    </div>
  </div>
</template>
