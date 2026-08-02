<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatPeriod } from '~/utils/date'
import { contactLines, hasContent, socialLines } from '~/utils/cvContent'

/**
 * Compact — bande latérale colorée étroite pour l'identité et le contact,
 * compétences en grille au sommet de la colonne principale.
 * L'ordre du document reste linéaire : identité, contact, profil, puis parcours.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactLines(props.profile.personal))
const socials = computed(() => socialLines(props.profile.personal))
</script>

<template>
  <CvPage :accent="accent" class="compact">
    <div class="layout">
      <aside class="side">
        <div v-if="profile.personal.photo" class="photo">
          <img :src="profile.personal.photo" alt="" />
        </div>

        <div class="identity">
          <p class="name">{{ profile.personal.firstName }}</p>
          <p class="name">{{ profile.personal.lastName }}</p>
          <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
        </div>

        <ul v-if="contacts.length || socials.length" class="lines">
          <li v-for="line in [...contacts, ...socials]" :key="line.value">
            <BaseIcon :name="line.icon" :size="10" />
            <span>{{ line.value }}</span>
          </li>
        </ul>

        <section v-if="has.summary">
          <h2>Profil professionnel</h2>
          <p>{{ profile.summary.content }}</p>
        </section>

        <section v-if="has.languages">
          <h2>Langues</h2>
          <div v-for="language in profile.languages" :key="language.id" class="lang">
            <p>{{ [language.name, language.level].filter(Boolean).join(' — ') }}</p>
            <span class="bar"><span class="fill" /></span>
          </div>
        </section>

        <section v-if="profile.interests.length">
          <h2>Centres d'intérêt</h2>
          <p>{{ profile.interests.join(' · ') }}</p>
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
            <p class="org">{{ [experience.company, experience.location].filter(Boolean).join(' - ') }}</p>
            <p class="title">{{ experience.position }}</p>
            <p class="dates">{{ formatPeriod(experience) }}</p>
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
            <p class="dates">{{ [project.context, formatPeriod(project)].filter(Boolean).join(' · ') }}</p>
            <p v-if="project.description" class="text">{{ project.description }}</p>
            <ul v-if="project.results.length">
              <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
            </ul>
          </div>
        </section>

        <section v-if="has.educations">
          <h2>Formation</h2>
          <div v-for="education in profile.educations" :key="education.id" class="entry">
            <p class="org">{{ [education.institution, education.location].filter(Boolean).join(' - ') }}</p>
            <p class="title">{{ education.degree }}</p>
            <p class="dates">{{ [formatPeriod(education), education.field].filter(Boolean).join(' · ') }}</p>
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
  </CvPage>
</template>

<style scoped>
.compact {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #1f1f1f;
  --page-bg: linear-gradient(
    to right,
    var(--cv-accent) 0 calc(46mm * var(--cv-zoom, 1)),
    #ffffff calc(46mm * var(--cv-zoom, 1))
  );
  background: var(--page-bg);
  print-color-adjust: exact;
  --accent-ink: color-mix(in srgb, var(--cv-accent) 78%, #000000);
  --grid-fill: var(--cv-accent);
  --grid-track: #e2e5e9;
  --grid-label: #555555;
}

.layout {
  display: grid;
  grid-template-columns: 46mm 1fr;
  min-height: var(--cv-page-height, 297mm);
}

/* Bande latérale */
.side {
  padding: 0 6mm 10mm;
  color: #ffffff;
  font-size: 8pt;
  line-height: 1.45;
}

.photo {
  width: 46mm;
  height: 46mm;
  margin: 0 0 5mm -6mm;
  overflow: hidden;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identity {
  margin-bottom: 5mm;
}

.name {
  font-size: 15pt;
  font-weight: 600;
  line-height: 1.15;
}

.identity .role {
  margin-top: 1.5mm;
  font-size: 8.5pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
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

.side section {
  margin-top: 6mm;
}

.side h2 {
  font-size: 8.5pt;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 1.2mm;
  margin-bottom: 2mm;
  border-bottom: 0.5pt solid rgba(255, 255, 255, 0.45);
}

.lang + .lang {
  margin-top: 2mm;
}

.lang .bar {
  display: block;
  height: 1.2mm;
  margin-top: 1mm;
  background: rgba(255, 255, 255, 0.3);
}

.lang .fill {
  display: block;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
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
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #262626;
  padding-bottom: 1.2mm;
  margin-bottom: 3mm;
  border-bottom: 0.75pt solid #d5d8dc;
}

.entry {
  margin-bottom: 4mm;
  break-inside: avoid;
}

.org {
  font-size: 8.5pt;
  color: #666666;
}

.entry .title {
  font-size: 10pt;
  font-weight: 700;
  margin-top: 0.3mm;
}

.dates {
  font-size: 8.5pt;
  color: var(--accent-ink);
  font-weight: 600;
  margin-top: 0.3mm;
}

.text {
  margin-top: 1.5mm;
  font-size: 9pt;
  text-align: justify;
}

ul {
  margin: 1.5mm 0 0 4mm;
  list-style: disc;
  font-size: 9pt;
}

li {
  margin-bottom: 0.8mm;
}
</style>
