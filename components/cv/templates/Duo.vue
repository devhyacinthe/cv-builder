<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatPeriod } from '~/utils/date'
import { contactLines, hasContent, socialLines } from '~/utils/cvContent'

/**
 * Duo — colonne sombre et coin d'accent, compétences en grille en tête de la
 * colonne principale. Contraste fort entre les deux colonnes, dates en accent.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactLines(props.profile.personal))
const socials = computed(() => socialLines(props.profile.personal))
</script>

<template>
  <PaperSheet :accent="accent" class="duo">
    <div class="layout">
      <aside class="side">
        <div class="corner" />

        <div v-if="profile.personal.photo" class="photo">
          <img :src="profile.personal.photo" alt="" />
        </div>

        <div class="identity">
          <p class="first">{{ profile.personal.firstName }}</p>
          <p class="last">{{ profile.personal.lastName }}</p>
          <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
        </div>

        <section v-if="contacts.length || socials.length">
          <h2>Contact</h2>
          <ul class="lines">
            <li v-for="line in [...contacts, ...socials]" :key="line.value">
              <BaseIcon :name="line.icon" :size="10" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>

        <section v-if="has.summary">
          <h2>Profil professionnel</h2>
          <p class="text">{{ profile.summary.content }}</p>
        </section>

        <section v-if="has.languages">
          <h2>Langues</h2>
          <p v-for="language in profile.languages" :key="language.id" class="lang">
            {{ [language.name, language.level].filter(Boolean).join(' | ') }}
          </p>
        </section>

        <section v-if="profile.interests.length">
          <h2>Centres d'intérêt</h2>
          <p class="text">{{ profile.interests.join(' · ') }}</p>
        </section>
      </aside>

      <main class="main">
        <section v-if="has.skills">
          <h2>Compétences</h2>
          <CvSkillGrid :categories="profile.skillCategories" />
        </section>

        <section v-if="has.experiences">
          <h2>Expériences professionnelles</h2>
          <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
            <p class="title">{{ experience.position }}</p>
            <p class="org">
              {{ [experience.company, experience.location].filter(Boolean).join(', ') }}
              <span class="dates">{{ formatPeriod(experience) }}</span>
            </p>
            <ul v-if="experience.highlights.length">
              <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
            </ul>
            <p v-else-if="experience.description" class="text">{{ experience.description }}</p>
          </div>
        </section>

        <section v-if="has.projects">
          <h2>Projets</h2>
          <div v-for="project in profile.projects" :key="project.id" class="entry">
            <p class="title">{{ project.name }}</p>
            <p class="org">
              {{ project.context }}
              <span class="dates">{{ formatPeriod(project) }}</span>
            </p>
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
            <p class="org">
              {{ [education.institution, education.location].filter(Boolean).join(', ') }}
              <span class="dates">{{ formatPeriod(education) }}</span>
            </p>
            <ul v-if="education.highlights.length">
              <li v-for="(highlight, index) in education.highlights" :key="index">{{ highlight }}</li>
            </ul>
          </div>
        </section>

        <section v-if="has.certifications">
          <h2>Certifications</h2>
          <p v-for="certification in profile.certifications" :key="certification.id" class="text">
            {{ [certification.name, certification.issuer].filter(Boolean).join(' · ') }}
          </p>
        </section>
      </main>
    </div>
  </PaperSheet>
</template>

<style scoped>
.duo {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #22262a;
  --page-bg: linear-gradient(
    to right,
    #33383d 0 calc(58mm * var(--paper-zoom, 1)),
    #ffffff calc(58mm * var(--paper-zoom, 1))
  );
  background: var(--page-bg);
  print-color-adjust: exact;
  --accent-on-dark: color-mix(in srgb, var(--paper-accent) 45%, #ffffff);
  --accent-ink: color-mix(in srgb, var(--paper-accent) 78%, #000000);
  --grid-fill: var(--paper-accent);
  --grid-track: #e3e6ea;
  --grid-label: #4a4a4a;
}

.layout {
  display: grid;
  grid-template-columns: 58mm 1fr;
  min-height: var(--paper-height, 297mm);
}

/* Colonne sombre */
.side {
  position: relative;
  padding: 12mm 8mm;
  color: #e8eaec;
  font-size: 8pt;
  line-height: 1.45;
}

.corner {
  position: absolute;
  top: 0;
  right: 0;
  border-top: 18mm solid var(--accent-on-dark);
  border-left: 18mm solid transparent;
}

.photo {
  width: 32mm;
  height: 32mm;
  margin: 2mm auto 5mm;
  border-radius: 50%;
  overflow: hidden;
}

.photo + .identity {
  margin-top: 0;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Sans photo, l'identité remonterait sous le coin d'accent : on la décale
   d'au moins la hauteur du coin. */
.identity {
  margin-top: 12mm;
  position: relative;
  margin-bottom: 7mm;
}

.first,
.last {
  font-size: 16pt;
  line-height: 1.15;
  overflow-wrap: break-word;
}

.first {
  font-weight: 400;
  color: #ffffff;
}

.last {
  font-weight: 700;
  color: #ffffff;
}

.identity .role {
  margin-top: 1.5mm;
  font-size: 8pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-on-dark);
}

.side section {
  margin-bottom: 6mm;
}

.side h2 {
  font-size: 8pt;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ffffff;
  padding-bottom: 1.2mm;
  margin-bottom: 2.5mm;
  border-bottom: 0.5pt solid rgba(255, 255, 255, 0.4);
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

.side .text {
  text-align: justify;
}

.lang + .lang {
  margin-top: 1mm;
}

/* Colonne principale */
.main {
  padding: 12mm 12mm 12mm 10mm;
}

.main section {
  margin-bottom: 6mm;
}

.main h2 {
  font-size: 10pt;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding-bottom: 1.2mm;
  margin-bottom: 3mm;
  border-bottom: 1pt solid var(--paper-accent);
}

.entry {
  margin-bottom: 4mm;
  break-inside: avoid;
}

.entry .title {
  font-size: 10pt;
  font-weight: 700;
}

.org {
  font-size: 8.5pt;
  color: #6a7075;
  margin-top: 0.3mm;
}

.dates {
  color: var(--accent-ink);
  font-weight: 600;
  margin-left: 2mm;
}

.main .text {
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
</style>
