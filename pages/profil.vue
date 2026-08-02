<script setup lang="ts">
import type { IconName } from '~/constants/icons'
import IdentitySection from '~/components/profile/IdentitySection.vue'
import SummarySection from '~/components/profile/SummarySection.vue'
import ExperienceSection from '~/components/profile/ExperienceSection.vue'
import EducationSection from '~/components/profile/EducationSection.vue'
import ProjectSection from '~/components/profile/ProjectSection.vue'
import SkillsSection from '~/components/profile/SkillsSection.vue'
import LanguagesSection from '~/components/profile/LanguagesSection.vue'
import CredentialsSection from '~/components/profile/CredentialsSection.vue'
import { skillCount } from '~/utils/profileStats'

const profileStore = useProfileStore()
const route = useRoute()
const router = useRouter()

interface Section {
  key: string
  label: string
  icon: IconName
  component: Component
  count?: () => number
}

const profile = computed(() => profileStore.profile)

const sections: Section[] = [
  { key: 'identite', label: 'Identité', icon: 'user', component: IdentitySection },
  { key: 'resume', label: 'Résumé', icon: 'document', component: SummarySection },
  {
    key: 'experiences',
    label: 'Expériences',
    icon: 'briefcase',
    component: ExperienceSection,
    count: () => profile.value.experiences.length,
  },
  {
    key: 'formations',
    label: 'Formations',
    icon: 'graduation',
    component: EducationSection,
    count: () => profile.value.educations.length,
  },
  {
    key: 'projets',
    label: 'Projets',
    icon: 'code',
    component: ProjectSection,
    count: () => profile.value.projects.length,
  },
  {
    key: 'competences',
    label: 'Compétences',
    icon: 'star',
    component: SkillsSection,
    count: () => skillCount(profile.value),
  },
  {
    key: 'langues',
    label: 'Langues',
    icon: 'globe',
    component: LanguagesSection,
    count: () => profile.value.languages.length,
  },
  {
    key: 'certifications',
    label: 'Certifications',
    icon: 'award',
    component: CredentialsSection,
    count: () => profile.value.certifications.length + profile.value.publications.length,
  },
]

// La section active vit dans l'URL : les liens du tableau de bord y renvoient.
const activeKey = computed(() => {
  const requested = String(route.query.section ?? '')
  return sections.some((section) => section.key === requested) ? requested : sections[0]!.key
})

const activeSection = computed(() => sections.find((section) => section.key === activeKey.value)!)

const select = (key: string) => router.replace({ query: { ...route.query, section: key } })
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-xl font-semibold tracking-tight">Profil professionnel</h1>
      <p class="mt-1 text-sm text-muted">
        Saisi une seule fois, réutilisé par tous vos CV et lettres. Enregistrement automatique.
      </p>
    </header>

    <nav class="-mx-1">
      <ul class="flex flex-wrap gap-1.5 px-1">
        <li v-for="section in sections" :key="section.key">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition-all duration-200"
            :class="
              activeKey === section.key
                ? 'border-brand bg-brand text-white shadow-sm'
                : 'border-line bg-surface text-muted hover:border-brand/30 hover:text-ink'
            "
            @click="select(section.key)"
          >
            <BaseIcon :name="section.icon" :size="16" />
            {{ section.label }}
            <span
              v-if="section.count?.()"
              class="rounded-full px-1.5 text-[11px] tabular-nums"
              :class="activeKey === section.key ? 'bg-white/20' : 'bg-canvas'"
            >
              {{ section.count() }}
            </span>
          </button>
        </li>
      </ul>
    </nav>

    <Transition name="slide" mode="out-in">
      <component :is="activeSection.component" :key="activeSection.key" />
    </Transition>
  </div>
</template>
