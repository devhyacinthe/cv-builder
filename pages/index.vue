<script setup lang="ts">
import { createSampleProfile } from '~/constants/sampleProfile'
import { formatDuration } from '~/utils/date'
import { activityByYear, experienceMonths, skillCount, skillsByCategory, topTechnologies } from '~/utils/profileStats'

const profileStore = useProfileStore()
const profile = computed(() => profileStore.profile)

const stats = computed(() => [
  { label: 'Expériences', value: profile.value.experiences.length, icon: 'briefcase' as const },
  {
    label: 'Expérience cumulée',
    value: formatDuration(experienceMonths(profile.value)),
    icon: 'chart' as const,
  },
  { label: 'Projets', value: profile.value.projects.length, icon: 'code' as const },
  {
    label: 'Compétences',
    value: skillCount(profile.value),
    hint: `${profile.value.skillCategories.length} catégories`,
    icon: 'star' as const,
  },
])

const categories = computed(() => skillsByCategory(profile.value))
const technologies = computed(() => topTechnologies(profile.value))
const activity = computed(() => activityByYear(profile.value))

function loadSample() {
  if (!profileStore.isEmpty && !confirm('Remplacer le profil actuel par le profil de démonstration ?')) return
  profileStore.replaceProfile(createSampleProfile())
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Tableau de bord</h1>
        <p class="mt-1 text-sm text-muted">
          Vos données restent dans ce navigateur et alimentent tous vos CV.
        </p>
      </div>
      <div class="flex gap-2">
        <BaseButton v-if="profileStore.isEmpty" size="sm" @click="loadSample">
          <BaseIcon name="plus" :size="16" />
          Charger un exemple
        </BaseButton>
        <BaseButton variant="primary" size="sm" to="/profil">
          <BaseIcon name="user" :size="16" />
          Compléter mon profil
        </BaseButton>
      </div>
    </header>

    <ProfileCompletion />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :hint="stat.hint"
        :icon="stat.icon"
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <BaseCard title="Compétences par catégorie" description="Répartition des compétences saisies.">
        <ChartBars :data="categories" empty="Ajoutez des compétences pour voir leur répartition." />
      </BaseCard>

      <BaseCard title="Technologies les plus présentes" description="Expériences et projets confondus.">
        <ChartBars :data="technologies" empty="Renseignez les technologies de vos expériences." />
      </BaseCard>
    </div>

    <BaseCard title="Activité par année" description="Expériences et projets actifs sur chaque année.">
      <ChartColumns :data="activity" />
    </BaseCard>
  </div>
</template>
