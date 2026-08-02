<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatMonth, formatPeriod } from '~/utils/date'
import { contactItems, fullName, hasContent, skillNames } from '~/utils/cvContent'

/**
 * Executive — colonne unique, contraste typographique marqué, beaucoup d'air.
 * L'accroche et les réalisations passent avant le détail opérationnel.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactItems(props.profile.personal))
</script>

<template>
  <PaperSheet :accent="accent" class="executive">
    <header class="head">
      <div class="identity">
        <h1>{{ fullName(profile.personal) || 'Prénom Nom' }}</h1>
        <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
      </div>
      <ul class="contact">
        <li v-for="item in contacts" :key="item">{{ item }}</li>
      </ul>
    </header>

    <p v-if="profile.summary.headline" class="headline">{{ profile.summary.headline }}</p>
    <p v-if="has.summary" class="lead">{{ profile.summary.content }}</p>

    <section v-if="has.skills">
      <h2>Domaines d'expertise</h2>
      <div class="expertise">
        <p v-for="category in profile.skillCategories" :key="category.id">
          <span class="label">{{ category.name }}</span>
          <span class="value">{{ skillNames(category.skills) }}</span>
        </p>
      </div>
    </section>

    <section v-if="has.experiences">
      <h2>Parcours professionnel</h2>
      <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
        <p class="company">{{ experience.company }}</p>
        <div class="entry-head">
          <p class="title">{{ experience.position }}</p>
          <p class="dates">{{ [formatPeriod(experience), experience.location].filter(Boolean).join(' · ') }}</p>
        </div>
        <p v-if="experience.description" class="text">{{ experience.description }}</p>
        <ul v-if="experience.highlights.length">
          <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.projects">
      <h2>Réalisations marquantes</h2>
      <div v-for="project in profile.projects" :key="project.id" class="entry">
        <div class="entry-head">
          <p class="title">{{ project.name }}</p>
          <p class="dates">{{ formatPeriod(project) }}</p>
        </div>
        <p v-if="project.description" class="text">{{ project.description }}</p>
        <ul v-if="project.results.length">
          <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.educations">
      <h2>Formation</h2>
      <div v-for="education in profile.educations" :key="education.id" class="line">
        <p class="title">{{ [education.degree, education.field].filter(Boolean).join(' — ') }}</p>
        <p class="dates">{{ [education.institution, formatPeriod(education)].filter(Boolean).join(' · ') }}</p>
      </div>
    </section>

    <section v-if="has.certifications || has.languages">
      <h2>Certifications et langues</h2>
      <div v-for="certification in profile.certifications" :key="certification.id" class="line">
        <p class="title">{{ certification.name }}</p>
        <p class="dates">{{ [certification.issuer, formatMonth(certification.date)].filter(Boolean).join(' · ') }}</p>
      </div>
      <p v-if="has.languages" class="text">
        {{ profile.languages.map((language) => [language.name, language.level].filter(Boolean).join(' — ')).join('  ·  ') }}
      </p>
    </section>
  </PaperSheet>
</template>

<style scoped>
.executive {
  padding: 16mm 18mm;
  font-family: Helvetica, 'Segoe UI', Arial, sans-serif;
  color: #202020;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10mm;
  padding-bottom: 4mm;
  border-bottom: 2pt solid var(--paper-accent);
}

h1 {
  font-size: 22pt;
  font-weight: 300;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1.1;
}

.head .role {
  margin-top: 2mm;
  font-size: 10pt;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--paper-accent);
}

.contact {
  list-style: none;
  text-align: right;
  font-size: 8.5pt;
  color: #4a4a4a;
  line-height: 1.6;
}

/* Accroche : seul endroit du document où le corps de texte grossit. */
.headline {
  margin-top: 6mm;
  font-size: 12pt;
  font-weight: 300;
  line-height: 1.4;
}

.lead {
  margin-top: 2.5mm;
  font-size: 9.5pt;
  line-height: 1.6;
  text-align: justify;
  color: #3a3a3a;
}

section {
  margin-top: 7mm;
}

h2 {
  font-size: 9pt;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--paper-accent);
  margin-bottom: 3mm;
}

.expertise {
  display: grid;
  gap: 1.5mm;
}

.expertise p {
  display: grid;
  grid-template-columns: 42mm 1fr;
  gap: 4mm;
  font-size: 9.5pt;
  padding-bottom: 1.5mm;
  border-bottom: 0.5pt solid #e0e0e0;
}

.label {
  font-weight: 700;
}

.value {
  color: #3a3a3a;
}

.entry {
  margin-bottom: 5mm;
  break-inside: avoid;
}

.company {
  font-size: 10.5pt;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.entry-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 5mm;
  margin-top: 0.5mm;
}

.entry-head .title {
  font-size: 9.5pt;
  font-weight: 600;
  color: #3a3a3a;
}

.dates {
  flex-shrink: 0;
  font-size: 8.5pt;
  color: #6a6a6a;
}

.text {
  margin-top: 1.5mm;
  font-size: 9.5pt;
  line-height: 1.55;
  text-align: justify;
}

ul {
  margin: 2mm 0 0 4.5mm;
  list-style: square;
  font-size: 9.5pt;
}

li {
  margin-bottom: 1.2mm;
  padding-left: 1mm;
}

.line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 5mm;
  padding-bottom: 1.5mm;
  margin-bottom: 1.5mm;
  border-bottom: 0.5pt solid #e0e0e0;
}

.line .title {
  font-size: 9.5pt;
  font-weight: 600;
}
</style>
