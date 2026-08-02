<script setup lang="ts">
import type { Letter } from '~/schemas/letter'
import type { Profile } from '~/schemas/profile'
import { contactItems, fullName } from '~/utils/cvContent'
import { letterParagraphs, letterSubject, placeAndDate, recipientLines } from '~/utils/letterContent'

/**
 * Moderne — en-tête typographique fort, filet d'accent pleine largeur,
 * objet dans un bloc coloré. La couleur porte les aplats, jamais le texte
 * courant : la lettre reste lisible en noir et blanc.
 */
const props = defineProps<{ letter: Letter; profile: Profile; accent: string }>()

const contacts = computed(() => contactItems(props.profile.personal))
const recipient = computed(() => recipientLines(props.letter))
const body = computed(() => letterParagraphs(props.letter))
</script>

<template>
  <PaperSheet :accent="accent" class="modern">
    <header class="head">
      <p class="name">{{ fullName(profile.personal) || 'Prénom Nom' }}</p>
      <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
      <p v-if="contacts.length" class="contacts">
        <span v-for="(item, index) in contacts" :key="item">
          <span v-if="index > 0" class="sep">·</span>{{ item }}
        </span>
      </p>
    </header>

    <div class="meta">
      <address v-if="recipient.length" class="recipient">
        <p v-for="line in recipient" :key="line">{{ line }}</p>
      </address>
      <p v-if="placeAndDate(letter)" class="date">{{ placeAndDate(letter) }}</p>
    </div>

    <div class="subject">
      <p class="subject-title">{{ letterSubject(letter) }}</p>
      <p v-if="letter.reference" class="reference">Référence : {{ letter.reference }}</p>
    </div>

    <p class="salutation">{{ letter.salutation }}</p>

    <p v-for="(paragraph, index) in body" :key="index" class="text">{{ paragraph }}</p>

    <p v-if="letter.closing" class="text closing">{{ letter.closing }}</p>

    <footer class="sign">
      <p class="sign-name">{{ fullName(profile.personal) }}</p>
      <p v-if="profile.personal.title" class="sign-role">{{ profile.personal.title }}</p>
    </footer>
  </PaperSheet>
</template>

<style scoped>
.modern {
  padding: 18mm 20mm 20mm;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.65;
  color: #1f1f1f;
  --accent-ink: color-mix(in srgb, var(--paper-accent) 78%, #000000);
}

.head {
  border-bottom: 2.5pt solid var(--paper-accent);
  padding-bottom: 3mm;
}

.name {
  font-size: 20pt;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.role {
  margin-top: 1mm;
  font-size: 10pt;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-ink);
}

.contacts {
  margin-top: 2.5mm;
  font-size: 9pt;
  color: #555555;
}

.sep {
  margin: 0 1.5mm;
  color: #aaaaaa;
}

.meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10mm;
  margin-top: 10mm;
}

.recipient {
  font-style: normal;
  font-size: 9.5pt;
  color: #333333;
  max-width: 80mm;
}

.date {
  font-size: 9.5pt;
  color: #555555;
  text-align: right;
  white-space: nowrap;
}

.subject {
  margin-top: 8mm;
  border-left: 3pt solid var(--paper-accent);
  background: color-mix(in srgb, var(--paper-accent) 8%, #ffffff);
  padding: 3mm 4mm;
  print-color-adjust: exact;
}

.subject-title {
  font-size: 11pt;
  font-weight: 600;
}

.reference {
  margin-top: 0.5mm;
  font-size: 9pt;
  color: #555555;
}

.salutation {
  margin-top: 7mm;
}

.text {
  margin-top: 4mm;
  text-align: justify;
}

.closing {
  margin-top: 6mm;
}

.sign {
  margin-top: 9mm;
  text-align: right;
}

.sign-name {
  font-weight: 600;
  color: var(--accent-ink);
}

.sign-role {
  font-size: 9pt;
  color: #666666;
}
</style>
