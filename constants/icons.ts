/**
 * Jeu d'icônes minimal, dessiné en traits sur une grille 24×24.
 * Un simple objet évite d'embarquer une librairie d'icônes entière.
 */
export const icons = {
  dashboard: ['M4 4h6v6H4z', 'M14 4h6v4h-6z', 'M14 12h6v8h-6z', 'M4 14h6v6H4z'],
  user: ['M4 20a8 8 0 0 1 16 0', 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
  document: ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5'],
  mail: ['M3 6h18v12H3z', 'm3.5 7 8.5 6 8.5-6'],
  chart: ['M4 20h16', 'M7 20v-6', 'M12 20V6', 'M17 20v-9'],
  briefcase: ['M3 8h18v12H3z', 'M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2', 'M3 13h18'],
  graduation: ['m12 4 10 5-10 5-10-5z', 'M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5'],
  code: ['m9 8-4 4 4 4', 'm15 8 4 4-4 4'],
  star: ['m12 4 2.3 5.3L20 10.5l-4.2 3.6L17 20l-5-2.8L7 20l1.2-5.9L4 10.5l5.7-1.2z'],
  globe: [
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    'M3 12h18',
    'M12 3c2.5 2.5 3.5 5.7 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.7-3.5-9s1-6.5 3.5-9',
  ],
  book: ['M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z', 'M18 16H7a2 2 0 0 0-2 2'],
  award: ['M16 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0', 'm9 13-1 7 4-2 4 2-1-7'],
  image: ['M4 5h16v14H4z', 'm5 16 4-4 3 3 3-3 4 4', 'M10 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0'],
  link: ['M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1', 'M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  trash: ['M4 7h16', 'M10 11v5', 'M14 11v5', 'm6 7 1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12', 'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  chevron: ['m6 9 6 6 6-6'],
  arrowUp: ['M12 19V5', 'm5 12 7-7 7 7'],
  arrowDown: ['M12 5v14', 'm19 12-7 7-7-7'],
  check: ['m5 13 4 4 10-10'],
  alert: ['M12 3 2.5 20h19z', 'M12 9v4', 'M12 16.5h.01'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  archive: ['M3 5h18v4H3z', 'M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9', 'M10 13h4'],
  download: ['M12 4v10', 'm7 11 5 5 5-5', 'M5 20h14'],
  upload: ['M12 20V10', 'm7 13 5-5 5 5', 'M5 4h14'],
  phone: ['M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2'],
  pin: ['M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11', 'M14.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'],
} as const

export type IconName = keyof typeof icons
