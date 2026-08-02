<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatMonth, formatPeriod } from '~/utils/date'
import { contactItems, fullName, hasContent, skillNames } from '~/utils/cvContent'

/**
 * ATS Classic — une seule colonne, aucune décoration superflue, titres de
 * sections standards : la structure la plus sûre pour un robot de recrutement.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactItems(props.profile.personal))
</script>

<template>
  <CvPage :accent="accent" class="ats">
    <header class="head">
      <h1 class="name">{{ fullName(profile.personal) || 'Prénom Nom' }}</h1>
      <p v-if="profile.personal.title" class="title">{{ profile.personal.title }}</p>
      <p v-if="contacts.length" class="contact">
        <span v-for="(item, index) in contacts" :key="item">
          <span v-if="index > 0" class="sep">·</span>{{ item }}
        </span>
      </p>
    </header>

    <section v-if="has.summary">
      <h2>Profil</h2>
      <p class="text">{{ profile.summary.content }}</p>
    </section>

    <section v-if="has.experiences">
      <h2>Expérience professionnelle</h2>
      <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
        <p class="entry-title">
          {{ experience.position }}<span v-if="experience.company"> — {{ experience.company }}</span>
        </p>
        <p class="entry-meta">
          {{ [formatPeriod(experience), experience.location].filter(Boolean).join(' · ') }}
        </p>
        <p v-if="experience.description" class="text">{{ experience.description }}</p>
        <ul v-if="experience.highlights.length">
          <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
        </ul>
        <p v-if="experience.technologies.length" class="tech">
          Technologies : {{ experience.technologies.join(', ') }}
        </p>
      </div>
    </section>

    <section v-if="has.educations">
      <h2>Formation</h2>
      <div v-for="education in profile.educations" :key="education.id" class="entry">
        <p class="entry-title">
          {{ education.degree }}<span v-if="education.field"> — {{ education.field }}</span>
        </p>
        <p class="entry-meta">
          {{ [education.institution, formatPeriod(education), education.location].filter(Boolean).join(' · ') }}
        </p>
        <p v-if="education.description" class="text">{{ education.description }}</p>
        <ul v-if="education.highlights.length">
          <li v-for="(highlight, index) in education.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.projects">
      <h2>Projets</h2>
      <div v-for="project in profile.projects" :key="project.id" class="entry">
        <p class="entry-title">
          {{ project.name }}<span v-if="project.context"> — {{ project.context }}</span>
        </p>
        <p v-if="formatPeriod(project)" class="entry-meta">{{ formatPeriod(project) }}</p>
        <p v-if="project.description" class="text">{{ project.description }}</p>
        <ul v-if="project.results.length">
          <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
        </ul>
        <p v-if="project.technologies.length" class="tech">
          Technologies : {{ project.technologies.join(', ') }}
        </p>
        <p v-if="project.repositoryUrl || project.demoUrl" class="tech">
          {{ [project.repositoryUrl, project.demoUrl].filter(Boolean).join(' · ') }}
        </p>
      </div>
    </section>

    <section v-if="has.skills">
      <h2>Compétences</h2>
      <p v-for="category in profile.skillCategories" :key="category.id" class="skills">
        <span class="skills-label">{{ category.name }} :</span> {{ skillNames(category.skills) }}
      </p>
    </section>

    <section v-if="has.languages">
      <h2>Langues</h2>
      <p class="text">
        {{
          profile.languages
            .map((language) => [language.name, language.level].filter(Boolean).join(' — '))
            .join(' · ')
        }}
      </p>
    </section>

    <section v-if="has.certifications">
      <h2>Certifications</h2>
      <p v-for="certification in profile.certifications" :key="certification.id" class="text">
        {{ [certification.name, certification.issuer, formatMonth(certification.date)].filter(Boolean).join(' · ') }}
      </p>
    </section>

    <section v-if="has.publications">
      <h2>Publications</h2>
      <p v-for="publication in profile.publications" :key="publication.id" class="text">
        {{ [publication.authors, publication.title, publication.venue, formatMonth(publication.date)].filter(Boolean).join('. ') }}
      </p>
    </section>
  </CvPage>
</template>

<style scoped>
/* Police universelle : aucun risque de substitution à l'analyse du PDF. */
.ats {
  padding: 15mm 18mm;
  font-family: Arial, Helvetica, sans-serif;
  color: #1a1a1a;
}

.head {
  border-bottom: 1.5pt solid var(--cv-accent);
  padding-bottom: 3mm;
  margin-bottom: 5mm;
}

.name {
  font-size: 19pt;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.1;
}

.title {
  margin-top: 1.5mm;
  font-size: 11pt;
  color: #3d3d3d;
}

.contact {
  margin-top: 2.5mm;
  font-size: 9pt;
  color: #444444;
}

.sep {
  margin: 0 1.5mm;
  color: #999999;
}

section {
  margin-bottom: 5mm;
}

h2 {
  font-size: 10.5pt;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cv-accent);
  border-bottom: 0.5pt solid #cccccc;
  padding-bottom: 1mm;
  margin-bottom: 2.5mm;
}

/* Une entrée ne doit jamais être coupée en deux par un saut de page. */
.entry {
  margin-bottom: 3.5mm;
  break-inside: avoid;
}

.entry:last-child {
  margin-bottom: 0;
}

.entry-title {
  font-size: 10.5pt;
  font-weight: 700;
}

.entry-meta {
  font-size: 9pt;
  color: #555555;
  margin-top: 0.5mm;
}

.text {
  margin-top: 1.5mm;
  text-align: justify;
}

ul {
  margin: 1.5mm 0 0 4.5mm;
  list-style: disc;
}

li {
  margin-bottom: 0.8mm;
}

.tech {
  margin-top: 1.5mm;
  font-size: 9.5pt;
  color: #333333;
}

.skills {
  margin-bottom: 1mm;
}

.skills-label {
  font-weight: 700;
}
</style>
