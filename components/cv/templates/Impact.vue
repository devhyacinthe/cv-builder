<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatPeriod } from '~/utils/date'
import { contactLines, hasContent, socialLines } from '~/utils/cvContent'

/**
 * Impact — large colonne d'accent pleine couleur pour l'identité, compétences
 * en grille et dates colorées dans la colonne principale. Le modèle le plus
 * affirmé de la bibliothèque.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactLines(props.profile.personal))
const socials = computed(() => socialLines(props.profile.personal))
</script>

<template>
  <CvPage :accent="accent" class="impact">
    <div class="layout">
      <aside class="side">
        <div v-if="profile.personal.photo" class="photo">
          <img :src="profile.personal.photo" alt="" />
        </div>

        <div class="identity">
          <p class="first">{{ profile.personal.firstName }}</p>
          <p class="last">{{ profile.personal.lastName }}</p>
          <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
        </div>

        <section v-if="contacts.length">
          <h2>Contact</h2>
          <ul class="lines">
            <li v-for="line in contacts" :key="line.value">
              <BaseIcon :name="line.icon" :size="10" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>

        <section v-if="socials.length">
          <h2>Réseaux</h2>
          <ul class="lines">
            <li v-for="line in socials" :key="line.value">
              <BaseIcon :name="line.icon" :size="10" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>
      </aside>

      <main class="main">
        <section v-if="has.summary">
          <h2>Profil professionnel</h2>
          <p class="text">{{ profile.summary.content }}</p>
        </section>

        <section v-if="has.skills">
          <h2>Compétences</h2>
          <CvSkillGrid :categories="profile.skillCategories" />
        </section>

        <section v-if="has.educations">
          <h2>Formation</h2>
          <div v-for="education in profile.educations" :key="education.id" class="entry">
            <p class="title">
              {{ education.degree }}
              <span class="dates">| {{ formatPeriod(education) }}</span>
            </p>
            <p class="org">{{ [education.institution, education.location].filter(Boolean).join(', ') }}</p>
            <p v-if="education.field" class="text">{{ education.field }}</p>
            <ul v-if="education.highlights.length">
              <li v-for="(highlight, index) in education.highlights" :key="index">{{ highlight }}</li>
            </ul>
          </div>
        </section>

        <section v-if="has.experiences">
          <h2>Expérience professionnelle</h2>
          <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
            <p class="title">
              {{ experience.position }}
              <span class="dates">| {{ formatPeriod(experience) }}</span>
            </p>
            <p class="org">{{ [experience.company, experience.location].filter(Boolean).join(', ') }}</p>
            <p v-if="experience.description" class="text">{{ experience.description }}</p>
            <ul v-if="experience.highlights.length">
              <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
            </ul>
          </div>
        </section>

        <section v-if="has.projects">
          <h2>Projets</h2>
          <div v-for="project in profile.projects" :key="project.id" class="entry">
            <p class="title">
              {{ project.name }}
              <span class="dates">| {{ formatPeriod(project) }}</span>
            </p>
            <p v-if="project.description" class="text">{{ project.description }}</p>
            <ul v-if="project.results.length">
              <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
            </ul>
          </div>
        </section>

        <section v-if="has.languages">
          <h2>Langues</h2>
          <div class="langs">
            <p v-for="language in profile.languages" :key="language.id">
              <span class="lang-name">{{ language.name }}</span>
              <span v-if="language.level"> | {{ language.level }}</span>
            </p>
          </div>
        </section>

        <section v-if="profile.interests.length">
          <h2>Centres d'intérêt</h2>
          <ul class="inline">
            <li v-for="interest in profile.interests" :key="interest">{{ interest }}</li>
          </ul>
        </section>
      </main>
    </div>
  </CvPage>
</template>

<style scoped>
.impact {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #22262a;
  --page-bg: linear-gradient(
    to right,
    var(--cv-accent) 0 calc(66mm * var(--cv-zoom, 1)),
    #ffffff calc(66mm * var(--cv-zoom, 1))
  );
  background: var(--page-bg);
  print-color-adjust: exact;
  --accent-ink: color-mix(in srgb, var(--cv-accent) 78%, #000000);
  --grid-fill: var(--cv-accent);
  --grid-track: #e3e6ea;
  --grid-label: #4a4a4a;
}

.layout {
  display: grid;
  grid-template-columns: 66mm 1fr;
  min-height: var(--cv-page-height, 297mm);
}

/* Colonne d'accent */
.side {
  padding: 12mm 9mm;
  color: #ffffff;
  font-size: 8.5pt;
  line-height: 1.5;
}

.photo {
  width: 40mm;
  height: 40mm;
  margin: 0 auto 7mm;
  border-radius: 50%;
  overflow: hidden;
  border: 1mm solid rgba(255, 255, 255, 0.85);
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identity {
  margin-bottom: 9mm;
}

.first,
.last {
  font-size: 19pt;
  line-height: 1.1;
  text-transform: uppercase;
  overflow-wrap: break-word;
}

.first {
  font-weight: 400;
}

.last {
  font-weight: 800;
}

.identity .role {
  margin-top: 2.5mm;
  font-size: 8.5pt;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.side h2 {
  font-size: 8.5pt;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding-bottom: 1.2mm;
  margin-bottom: 2.5mm;
  border-bottom: 0.5pt solid rgba(255, 255, 255, 0.5);
}

.side section {
  margin-bottom: 6mm;
}

.lines {
  display: grid;
  gap: 1.5mm;
}

.lines li {
  display: grid;
  grid-template-columns: 4.5mm 1fr;
  align-items: start;
  gap: 1mm;
  overflow-wrap: anywhere;
}

/* Colonne principale */
.main {
  padding: 12mm 12mm 12mm 10mm;
}

.main section {
  margin-bottom: 6mm;
}

.main h2 {
  font-size: 10.5pt;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 3mm;
}

.entry {
  margin-bottom: 4mm;
  break-inside: avoid;
}

.entry .title {
  font-size: 10pt;
  font-weight: 700;
}

.dates {
  font-weight: 400;
  font-size: 8.5pt;
  color: #6d7278;
}

.org {
  font-size: 9pt;
  color: var(--accent-ink);
  font-weight: 600;
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
  margin-bottom: 0.8mm;
}

.langs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2mm 5mm;
  font-size: 9pt;
}

.lang-name {
  font-weight: 700;
}

.inline {
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5mm 4mm;
  font-size: 9pt;
}

.inline li {
  margin: 0;
}
</style>
