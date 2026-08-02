<script setup lang="ts">
import type { Profile } from '~/schemas/profile'
import { formatMonth, formatPeriod } from '~/utils/date'
import { contactLines, hasContent, skillNames, socialLines } from '~/utils/cvContent'

/**
 * Modern Professional — colonne latérale sombre, photo circulaire, colonne de
 * dates à gauche de chaque entrée. Hiérarchie portée par la graisse et
 * l'espacement plutôt que par la couleur.
 */
const props = defineProps<{ profile: Profile; accent: string }>()

const has = computed(() => hasContent(props.profile))
const contacts = computed(() => contactLines(props.profile.personal))
const socials = computed(() => socialLines(props.profile.personal))
</script>

<template>
  <PaperSheet :accent="accent" class="modern">
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

        <section v-if="contacts.length">
          <h2>Contact</h2>
          <ul class="lines">
            <li v-for="line in contacts" :key="line.value">
              <BaseIcon :name="line.icon" :size="11" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>

        <section v-if="socials.length">
          <h2>Liens</h2>
          <ul class="lines">
            <li v-for="line in socials" :key="line.value">
              <BaseIcon :name="line.icon" :size="11" />
              <span>{{ line.value }}</span>
            </li>
          </ul>
        </section>

        <section v-if="has.languages">
          <h2>Langues</h2>
          <ul class="plain">
            <li v-for="language in profile.languages" :key="language.id">
              {{ [language.name, language.level].filter(Boolean).join(' | ') }}
              <span v-if="language.certification" class="note">{{ language.certification }}</span>
            </li>
          </ul>
        </section>

        <section v-if="has.skills">
          <h2>Compétences</h2>
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
      </aside>

      <main class="main">
        <section v-if="has.summary">
          <h2>Profil professionnel</h2>
          <p class="text">{{ profile.summary.content }}</p>
        </section>

        <section v-if="has.experiences">
          <h2>Expériences professionnelles</h2>
          <div v-for="experience in profile.experiences" :key="experience.id" class="entry">
            <div class="when">
              <p>{{ formatPeriod(experience) }}</p>
              <p v-if="experience.location" class="place">{{ experience.location }}</p>
            </div>
            <div class="what">
              <p class="role">{{ experience.position }}</p>
              <p v-if="experience.company" class="org">{{ experience.company }}</p>
              <p v-if="experience.description" class="text">{{ experience.description }}</p>
              <ul v-if="experience.highlights.length" class="bullets">
                <li v-for="(highlight, index) in experience.highlights" :key="index">{{ highlight }}</li>
              </ul>
              <p v-if="experience.technologies.length" class="tags">{{ experience.technologies.join(' · ') }}</p>
            </div>
          </div>
        </section>

        <section v-if="has.educations">
          <h2>Formation</h2>
          <div v-for="education in profile.educations" :key="education.id" class="entry">
            <div class="when">
              <p>{{ formatPeriod(education) }}</p>
              <p v-if="education.location" class="place">{{ education.location }}</p>
            </div>
            <div class="what">
              <p class="role">{{ [education.degree, education.field].filter(Boolean).join(' — ') }}</p>
              <p v-if="education.institution" class="org">{{ education.institution }}</p>
              <p v-if="education.description" class="text">{{ education.description }}</p>
            </div>
          </div>
        </section>

        <section v-if="has.projects">
          <h2>Projets</h2>
          <div v-for="project in profile.projects" :key="project.id" class="entry">
            <div class="when">
              <p>{{ formatPeriod(project) }}</p>
            </div>
            <div class="what">
              <p class="role">{{ project.name }}</p>
              <p v-if="project.context" class="org">{{ project.context }}</p>
              <p v-if="project.description" class="text">{{ project.description }}</p>
              <ul v-if="project.results.length" class="bullets">
                <li v-for="(result, index) in project.results" :key="index">{{ result }}</li>
              </ul>
              <p v-if="project.technologies.length" class="tags">{{ project.technologies.join(' · ') }}</p>
            </div>
          </div>
        </section>

        <section v-if="has.certifications">
          <h2>Certifications</h2>
          <div v-for="certification in profile.certifications" :key="certification.id" class="entry">
            <div class="when">
              <p>{{ formatMonth(certification.date) }}</p>
            </div>
            <div class="what">
              <p class="role">{{ certification.name }}</p>
              <p v-if="certification.issuer" class="org">{{ certification.issuer }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </PaperSheet>
</template>

<style scoped>
/* Le dégradé porte le fond de la colonne : il se répète sur chaque page imprimée. */
.modern {
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  --page-bg: linear-gradient(
    to right,
    #2f363d 0 calc(64mm * var(--paper-zoom, 1)),
    #ffffff calc(64mm * var(--paper-zoom, 1))
  );
  background: var(--page-bg);
  print-color-adjust: exact;
  /* Sur la colonne sombre, l'accent est éclairci : une teinte sobre choisie
     pour du texte noir resterait illisible sur fond charbon. */
  --accent-on-dark: color-mix(in srgb, var(--paper-accent) 45%, #ffffff);
}

.layout {
  display: grid;
  grid-template-columns: 64mm 1fr;
  min-height: var(--paper-height, 297mm);
}

/* Colonne latérale */
.side {
  position: relative;
  padding: 10mm 8mm;
  color: #e6e9ec;
  font-size: 8.5pt;
  line-height: 1.5;
}

.corner {
  position: absolute;
  top: 0;
  left: 0;
  border-top: 22mm solid var(--accent-on-dark);
  border-right: 22mm solid transparent;
}

.photo {
  position: relative;
  width: 30mm;
  height: 30mm;
  margin: 5mm auto 5mm;
  border-radius: 50%;
  overflow: hidden;
  border: 1mm solid #ffffff;
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
  margin-top: 16mm;
  position: relative;
  margin-bottom: 8mm;
}

.first,
.last {
  font-size: 18pt;
  line-height: 1.15;
  text-transform: uppercase;
  overflow-wrap: break-word;
}

/* Le prénom reste en graisse légère mais doit lire aussi franchement que le
   nom : blanc pur et interlettrage un peu ouvert sur fond sombre. */
.first {
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #ffffff;
}

.last {
  font-weight: 700;
  color: var(--accent-on-dark);
}

.identity .role {
  margin-top: 2mm;
  font-size: 8.5pt;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #aeb5bc;
}

.side section {
  margin-top: 7mm;
}

.side h2 {
  padding-top: 2.5mm;
  border-top: 0.5pt solid rgba(255, 255, 255, 0.35);
  margin-bottom: 2.5mm;
  font-size: 9pt;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ffffff;
}

.lines {
  display: grid;
  gap: 1.5mm;
}

.lines li {
  display: grid;
  grid-template-columns: 5mm 1fr;
  align-items: start;
  gap: 1mm;
  overflow-wrap: anywhere;
}

.plain li {
  margin-bottom: 1.5mm;
}

.note {
  display: block;
  color: #aeb5bc;
}

.group {
  margin-bottom: 3mm;
}

.group-name {
  font-weight: 600;
  margin-bottom: 1mm;
}

.soft {
  color: #cfd4d9;
}

.skill {
  display: grid;
  gap: 0.8mm;
  margin-bottom: 1.5mm;
}

.bar {
  display: block;
  height: 1.2mm;
  background: rgba(255, 255, 255, 0.22);
}

.fill {
  display: block;
  height: 100%;
  background: var(--accent-on-dark);
}

/* Colonne principale */
.main {
  padding: 12mm 12mm 12mm 10mm;
  color: #23282d;
}

.main section {
  margin-bottom: 6mm;
}

.main h2 {
  padding-top: 2.5mm;
  border-top: 1pt solid #23282d;
  margin-bottom: 3mm;
  font-size: 10.5pt;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.entry {
  display: grid;
  grid-template-columns: 26mm 1fr;
  gap: 4mm;
  margin-bottom: 4mm;
  break-inside: avoid;
}

.when {
  font-size: 8.5pt;
  color: #6d7479;
  padding-top: 0.5mm;
}

.place {
  margin-top: 0.5mm;
}

.what .role {
  font-size: 10pt;
  font-weight: 700;
}

.what .org {
  font-size: 9.5pt;
  color: var(--paper-accent);
  margin-top: 0.3mm;
}

.text {
  margin-top: 1.5mm;
  font-size: 9.5pt;
  text-align: justify;
  hyphens: auto;
}

.bullets {
  margin: 1.5mm 0 0 4mm;
  list-style: disc;
  font-size: 9.5pt;
}

.bullets li {
  margin-bottom: 1mm;
}

.tags {
  margin-top: 1.5mm;
  font-size: 8.5pt;
  color: #6d7479;
}
</style>
