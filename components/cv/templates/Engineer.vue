<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatMonth, formatPeriod } from '~/utils/date'
import { contactLines, fullName, hasContent, skillNames, socialLines } from '~/utils/cvContent'

/**
 * Engineer — colonne technique à droite, projets au même rang que les
 * expériences, technologies visibles d'un coup d'œil. Titres soulignés d'un
 * court trait d'accent, dates alignées à droite de chaque entrée.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactLines(props.profile.personal))
const socials = computed(() => socialLines(props.profile.personal))

/** Stack technique : technologies dédupliquées, les plus utilisées d'abord. */
const stack = computed(() => {
  const counts = new Map<string, number>()
  const collect = (technologies: string[]) => {
    for (const raw of technologies) {
      const name = raw.trim()
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  props.profile.experiences.forEach((experience) => collect(experience.technologies))
  props.profile.projects.forEach((project) => collect(project.technologies))
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)
})
</script>

<template>
  <PaperSheet :accent="accent" class="engineer">
    <div class="layout">
      <main class="main">
        <header class="head">
          <h1>{{ fullName(profile.personal) || 'Prénom Nom' }}</h1>
          <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
          <p v-if="has.summary" class="lead">{{ profile.summary.content }}</p>
        </header>

        <section v-if="has.experiences">
          <h2>Expérience</h2>
          <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
            <div class="entry-head">
              <p class="title">{{ experience.position }}</p>
              <p class="dates">{{ formatPeriod(experience) }}</p>
            </div>
            <p class="org">{{ [experience.company, experience.location].filter(Boolean).join(' · ') }}</p>
            <p v-if="experience.description" class="text">{{ experience.description }}</p>
            <ul v-if="experience.highlights.length">
              <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
            </ul>
            <p v-if="experience.technologies.length" class="tech">{{ experience.technologies.join(' · ') }}</p>
          </div>
        </section>

        <section v-if="has.projects">
          <h2>Projets</h2>
          <div v-for="project in profile.projects" :key="project.id" class="entry">
            <div class="entry-head">
              <p class="title">{{ project.name }}</p>
              <p class="dates">{{ formatPeriod(project) }}</p>
            </div>
            <p v-if="project.context" class="org">{{ project.context }}</p>
            <p v-if="project.description" class="text">{{ project.description }}</p>
            <ul v-if="project.results.length">
              <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
            </ul>
            <p v-if="project.technologies.length" class="tech">{{ project.technologies.join(' · ') }}</p>
            <p v-if="project.repositoryUrl || project.demoUrl" class="link">
              {{ [project.repositoryUrl, project.demoUrl].filter(Boolean).join(' · ') }}
            </p>
          </div>
        </section>

        <section v-if="has.educations">
          <h2>Formation</h2>
          <div v-for="education in profile.educations" :key="education.id" class="entry">
            <div class="entry-head">
              <p class="title">{{ [education.degree, education.field].filter(Boolean).join(' — ') }}</p>
              <p class="dates">{{ formatPeriod(education) }}</p>
            </div>
            <p class="org">{{ [education.institution, education.location].filter(Boolean).join(' · ') }}</p>
            <p v-if="education.description" class="text">{{ education.description }}</p>
          </div>
        </section>
      </main>

      <aside class="side">
        <div v-if="profile.personal.photo" class="photo">
          <img :src="profile.personal.photo" alt="" />
        </div>

        <section v-if="contacts.length">
          <h3>Contact</h3>
          <ul class="lines">
            <li v-for="line in contacts" :key="line.value">
              <BaseIcon :name="line.icon" :size="10" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>

        <section v-if="socials.length">
          <h3>Liens</h3>
          <ul class="lines">
            <li v-for="line in socials" :key="line.value">
              <BaseIcon :name="line.icon" :size="10" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>

        <section v-if="stack.length">
          <h3>Stack technique</h3>
          <ul class="chips">
            <li v-for="item in stack" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section v-if="has.skills">
          <h3>Compétences</h3>
          <div v-for="category in profile.skillCategories" :key="category.id" class="group">
            <p class="group-name">{{ category.name }}</p>
            <!-- Les compétences transversales ne se mesurent pas : pas de barre. -->
            <p v-if="category.kind === 'soft'" class="soft">{{ skillNames(category.skills) }}</p>
            <template v-else>
              <div v-for="skill in category.skills" :key="skill.id" class="skill">
                <span>{{ skill.name }}</span>
                <span class="bar"><span class="fill" :style="{ width: `${skill.level * 20}%` }" /></span>
              </div>
            </template>
          </div>
        </section>

        <section v-if="has.languages">
          <h3>Langues</h3>
          <ul class="plain">
            <li v-for="language in profile.languages" :key="language.id">
              {{ [language.name, language.level].filter(Boolean).join(' — ') }}
            </li>
          </ul>
        </section>

        <section v-if="has.certifications">
          <h3>Certifications</h3>
          <ul class="plain">
            <li v-for="certification in profile.certifications" :key="certification.id">
              {{ certification.name }}
              <span class="muted">{{ [certification.issuer, formatMonth(certification.date)].filter(Boolean).join(' · ') }}</span>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </PaperSheet>
</template>

<style scoped>
.engineer {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #1f2429;
  --page-bg: linear-gradient(
    to right,
    #ffffff 0 calc(138mm * var(--paper-zoom, 1)),
    #f2f4f6 calc(138mm * var(--paper-zoom, 1))
  );
  background: var(--page-bg);
  print-color-adjust: exact;
}

.layout {
  display: grid;
  grid-template-columns: 138mm 72mm;
  min-height: var(--paper-height, 297mm);
}

.main {
  padding: 13mm 10mm 13mm 14mm;
}

.head {
  margin-bottom: 7mm;
}

h1 {
  font-size: 21pt;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.head .role {
  margin-top: 1mm;
  font-size: 10.5pt;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--paper-accent);
}

.lead {
  margin-top: 3mm;
  font-size: 9.5pt;
  line-height: 1.5;
  text-align: justify;
  color: #3c434a;
}

.main section {
  margin-bottom: 6mm;
}

/* Titre de section : court trait d'accent, sans filet pleine largeur. */
h2 {
  font-size: 10pt;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding-bottom: 1.5mm;
  margin-bottom: 3mm;
  border-bottom: 1.5pt solid var(--paper-accent);
  width: fit-content;
  padding-right: 6mm;
}

.entry {
  margin-bottom: 4mm;
  break-inside: avoid;
}

.entry-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4mm;
}

.entry .title {
  font-size: 10pt;
  font-weight: 700;
}

.dates {
  flex-shrink: 0;
  font-size: 8.5pt;
  color: #6b7278;
}

.org {
  font-size: 9pt;
  color: #4b5259;
  margin-top: 0.3mm;
}

.text {
  margin-top: 1.5mm;
  font-size: 9.5pt;
  text-align: justify;
}

ul {
  margin: 1.5mm 0 0 4mm;
  list-style: disc;
  font-size: 9.5pt;
}

li {
  margin-bottom: 1mm;
}

.tech,
.link {
  margin-top: 1.5mm;
  font-size: 8.5pt;
  color: #6b7278;
}

/* Colonne technique */
.side {
  padding: 13mm 10mm;
  font-size: 8.5pt;
  line-height: 1.45;
  color: #2b3137;
}

.photo {
  width: 30mm;
  height: 30mm;
  margin-bottom: 6mm;
  border-radius: 2mm;
  overflow: hidden;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.side section {
  margin-bottom: 6mm;
}

h3 {
  font-size: 8.5pt;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--paper-accent);
  margin-bottom: 2.5mm;
}

.lines {
  margin: 0;
  list-style: none;
  display: grid;
  gap: 1.5mm;
  font-size: 8.5pt;
}

.lines li {
  display: grid;
  grid-template-columns: 4.5mm 1fr;
  align-items: start;
  gap: 1mm;
  margin: 0;
  overflow-wrap: anywhere;
}

.chips {
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2mm;
}

.chips li {
  margin: 0;
  padding: 0.8mm 2mm;
  border: 0.5pt solid #c9cfd5;
  border-radius: 1mm;
  background: #ffffff;
  font-size: 8pt;
}

.plain {
  margin: 0;
  list-style: none;
}

.plain li {
  margin-bottom: 1.5mm;
}

.muted {
  display: block;
  color: #6b7278;
}

.group {
  margin-bottom: 2.5mm;
}

.group-name {
  font-weight: 600;
  margin-bottom: 1mm;
}

.soft {
  color: #4b5259;
}

.skill {
  display: grid;
  gap: 0.8mm;
  margin-bottom: 1.5mm;
}

.bar {
  display: block;
  height: 1.2mm;
  background: #d7dce1;
}

.fill {
  display: block;
  height: 100%;
  background: var(--paper-accent);
}
</style>
