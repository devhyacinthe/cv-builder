<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatMonth, formatPeriod } from '~/utils/date'
import { contactItems, fullName, hasContent, skillNames } from '~/utils/cvContent'

/**
 * Academic / Research — typographie à empattements, en-tête encadré, colonne
 * unique et ordre académique : formation et travaux avant l'expérience.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactItems(props.profile.personal))
</script>

<template>
  <PaperSheet :accent="accent" class="academic">
    <header class="head">
      <div class="frame">
        <h1>{{ fullName(profile.personal) || 'Prénom Nom' }}</h1>
        <span class="rule" />
        <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
      </div>
      <p v-if="contacts.length" class="contact">{{ contacts.join('  ·  ') }}</p>
    </header>

    <section v-if="has.summary">
      <h2>Présentation</h2>
      <p class="text">{{ profile.summary.content }}</p>
      <p v-if="profile.summary.objective" class="text objective">{{ profile.summary.objective }}</p>
    </section>

    <section v-if="has.educations">
      <h2>Formation</h2>
      <div v-for="education in profile.educations" :key="education.id" class="entry">
        <div class="entry-head">
          <p class="title">{{ [education.degree, education.field].filter(Boolean).join(', ') }}</p>
          <p class="dates">{{ formatPeriod(education, 'long') }}</p>
        </div>
        <p class="org">{{ [education.institution, education.location].filter(Boolean).join(', ') }}</p>
        <p v-if="education.description" class="text">{{ education.description }}</p>
        <ul v-if="education.highlights.length">
          <li v-for="(highlight, index) in education.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.publications">
      <h2>Publications</h2>
      <ol class="publications">
        <li v-for="publication in profile.publications" :key="publication.id">
          <span class="authors">{{ publication.authors }}</span>
          <span v-if="publication.authors">. </span>
          <span class="title-italic">{{ publication.title }}</span>
          <span v-if="publication.venue">. {{ publication.venue }}</span>
          <span v-if="publication.date">, {{ formatMonth(publication.date, 'long') }}</span>
        </li>
      </ol>
    </section>

    <section v-if="has.projects">
      <h2>Travaux de recherche et projets</h2>
      <div v-for="project in profile.projects" :key="project.id" class="entry">
        <div class="entry-head">
          <p class="title">{{ project.name }}</p>
          <p class="dates">{{ formatPeriod(project, 'long') }}</p>
        </div>
        <p v-if="project.context" class="org">{{ project.context }}</p>
        <p v-if="project.description" class="text">{{ project.description }}</p>
        <ul v-if="project.results.length">
          <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
        </ul>
        <p v-if="project.technologies.length" class="meta">Méthodes et outils : {{ project.technologies.join(', ') }}</p>
      </div>
    </section>

    <section v-if="has.experiences">
      <h2>Expérience professionnelle</h2>
      <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
        <div class="entry-head">
          <p class="title">{{ experience.position }}</p>
          <p class="dates">{{ formatPeriod(experience, 'long') }}</p>
        </div>
        <p class="org">{{ [experience.company, experience.location].filter(Boolean).join(', ') }}</p>
        <p v-if="experience.description" class="text">{{ experience.description }}</p>
        <ul v-if="experience.highlights.length">
          <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.certifications">
      <h2>Certifications</h2>
      <p v-for="certification in profile.certifications" :key="certification.id" class="text">
        {{ [certification.name, certification.issuer, formatMonth(certification.date, 'long')].filter(Boolean).join(', ') }}
      </p>
    </section>

    <section v-if="has.skills">
      <h2>Compétences</h2>
      <p v-for="category in profile.skillCategories" :key="category.id" class="text">
        <span class="label">{{ category.name }} :</span> {{ skillNames(category.skills) }}
      </p>
    </section>

    <section v-if="has.languages">
      <h2>Langues</h2>
      <p class="text">
        {{ profile.languages.map((language) => [language.name, language.level].filter(Boolean).join(', ')).join('  ·  ') }}
      </p>
    </section>
  </PaperSheet>
</template>

<style scoped>
.academic {
  padding: 14mm 20mm;
  font-family: Georgia, 'Times New Roman', serif;
  color: #1c1c1c;
  font-size: 10pt;
}

.head {
  text-align: center;
  margin-bottom: 7mm;
}

/* En-tête encadré : le nom est le seul élément mis en scène. */
.frame {
  display: inline-block;
  padding: 4mm 12mm;
  border: 0.75pt solid #1c1c1c;
}

h1 {
  font-size: 17pt;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1.2;
}

.rule {
  display: block;
  width: 16mm;
  height: 0.75pt;
  background: var(--paper-accent);
  margin: 2mm auto;
}

.frame .role {
  font-size: 9.5pt;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.contact {
  margin-top: 3.5mm;
  font-size: 9pt;
  color: #454545;
}

section {
  margin-bottom: 5.5mm;
}

h2 {
  font-size: 10.5pt;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--paper-accent);
  border-bottom: 0.5pt solid #b6b6b6;
  padding-bottom: 1.2mm;
  margin-bottom: 2.5mm;
}

.entry {
  margin-bottom: 3.5mm;
  break-inside: avoid;
}

.entry-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 5mm;
}

.title {
  font-weight: 700;
}

.dates {
  flex-shrink: 0;
  font-size: 9pt;
  color: #4d4d4d;
}

.org {
  font-style: italic;
  color: #3a3a3a;
}

.text {
  margin-top: 1.2mm;
  text-align: justify;
  line-height: 1.5;
}

.objective {
  color: #3a3a3a;
}

.label {
  font-weight: 700;
}

.meta {
  margin-top: 1.2mm;
  font-size: 9pt;
  color: #4d4d4d;
}

ul {
  margin: 1.2mm 0 0 5mm;
  list-style: disc;
}

.publications {
  margin: 0 0 0 5mm;
  list-style: decimal;
  line-height: 1.5;
}

.publications li {
  margin-bottom: 1.5mm;
  break-inside: avoid;
}

.authors {
  font-variant: small-caps;
}

.title-italic {
  font-style: italic;
}
</style>
