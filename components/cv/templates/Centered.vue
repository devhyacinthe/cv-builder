<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatPeriod } from '~/utils/date'
import { contactItems, fullName, hasContent } from '~/utils/cvContent'

/**
 * Centré — colonne unique, en-tête centré, titres de sections encadrés de
 * filets. Aucune colonne latérale : c'est la structure la plus fiable pour un
 * analyseur automatique, tout en restant élégante.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactItems(props.profile.personal))
</script>

<template>
  <CvPage :accent="accent" class="centered">
    <header class="head">
      <div v-if="profile.personal.photo" class="photo">
        <img :src="profile.personal.photo" alt="" />
      </div>
      <h1>{{ fullName(profile.personal) || 'Prénom Nom' }}</h1>
      <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
      <p v-if="contacts.length" class="contact">{{ contacts.join(' • ') }}</p>
    </header>

    <section v-if="has.summary">
      <h2>Profil professionnel</h2>
      <p class="text">{{ profile.summary.content }}</p>
    </section>

    <section v-if="has.experiences">
      <h2>Expériences professionnelles</h2>
      <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
        <p class="title">{{ [experience.position, experience.company].filter(Boolean).join(' — ') }}</p>
        <p class="meta">{{ [formatPeriod(experience), experience.location].filter(Boolean).join(' · ') }}</p>
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
        <p class="title">{{ project.name }}</p>
        <p class="meta">{{ [project.context, formatPeriod(project)].filter(Boolean).join(' · ') }}</p>
        <p v-if="project.description" class="text">{{ project.description }}</p>
        <ul v-if="project.results.length">
          <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.educations">
      <h2>Formation</h2>
      <div v-for="education in profile.educations" :key="education.id" class="entry">
        <p class="title">{{ [education.degree, education.field].filter(Boolean).join(' — ') }}</p>
        <p class="meta">
          {{ [education.institution, formatPeriod(education), education.location].filter(Boolean).join(' · ') }}
        </p>
        <ul v-if="education.highlights.length">
          <li v-for="(highlight, index) in education.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>
    </section>

    <section v-if="has.skills">
      <h2>Compétences</h2>
      <CvSkillGrid :categories="profile.skillCategories" />
    </section>

    <section v-if="has.languages || profile.interests.length">
      <h2>Langues et centres d'intérêt</h2>
      <div class="split">
        <p v-if="has.languages">
          {{ profile.languages.map((language) => [language.name, language.level].filter(Boolean).join(' — ')).join('  ·  ') }}
        </p>
        <p v-if="profile.interests.length">{{ profile.interests.join(' · ') }}</p>
      </div>
    </section>

    <section v-if="has.certifications">
      <h2>Certifications</h2>
      <p v-for="certification in profile.certifications" :key="certification.id" class="text">
        {{ [certification.name, certification.issuer].filter(Boolean).join(' · ') }}
      </p>
    </section>
  </CvPage>
</template>

<style scoped>
.centered {
  padding: 14mm 18mm;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #1f1f1f;
  --grid-fill: var(--cv-accent);
  --grid-track: #e2e5e9;
  --grid-label: #5a5a5a;
}

.head {
  text-align: center;
  padding-bottom: 5mm;
}

.photo {
  width: 28mm;
  height: 28mm;
  margin: 0 auto 3mm;
  border-radius: 50%;
  overflow: hidden;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h1 {
  font-size: 18pt;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.head .role {
  margin-top: 1mm;
  font-size: 10pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cv-accent);
}

.contact {
  margin-top: 2.5mm;
  font-size: 8.5pt;
  color: #555555;
}

section {
  margin-bottom: 5mm;
}

/* Titre centré, souligné d'un filet pleine largeur. */
h2 {
  text-align: center;
  padding-bottom: 1.5mm;
  margin-bottom: 3mm;
  border-bottom: 0.5pt solid #cfd3d8;
  font-size: 9pt;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #4a4a4a;
}

.entry {
  margin-bottom: 3.5mm;
  break-inside: avoid;
}

.entry .title {
  font-size: 10pt;
  font-weight: 700;
}

.meta {
  font-size: 8.5pt;
  color: #666666;
  margin-top: 0.3mm;
}

.text {
  margin-top: 1.5mm;
  font-size: 9.5pt;
  text-align: justify;
}

ul {
  margin: 1.5mm 0 0 4.5mm;
  list-style: disc;
  font-size: 9.5pt;
}

li {
  margin-bottom: 0.8mm;
}

.tech {
  margin-top: 1.2mm;
  font-size: 8.5pt;
  color: #666666;
}

.split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4mm;
  font-size: 9pt;
}
</style>
