/**
 * Samanvayam 2026 (Sampada CME): single source of truth for the homepage section
 * (src/components/CmeFeature.astro) and the registration page (src/pages/cme/index.astro).
 * Content follows the printed brochure. Edit speakers, timings and the registration endpoint here.
 */

/**
 * Google Apps Script web-app URL that stores registrations in a Google Sheet.
 * Setup steps are in docs/cme-registration/Code.gs.
 * While this is empty, the form falls back to a pre-filled WhatsApp message to the CME number.
 */
export const REGISTRATION_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxhdlAXLhIIhpwjTwcaLAge5ioLXBW4G-pPGWkSwEcrmsFLzzj_VR0faDQYbuFiFjg/exec';

export const CME = {
  path: '/cme/',
  name: 'Samanvayam 2026',
  malayalam: 'സമന്വയം',
  series: 'Sampada CME',
  theme: 'Where Specialties converge, care evolves',
  kind: 'A multidisciplinary clinical update for doctors',
  about:
    'Samanvayam brings together doctors from ophthalmology, paediatrics and general medicine to discuss the prevention, early detection and management of vision-threatening conditions. The meeting focuses on practical clinical knowledge, timely referral, multidisciplinary collaboration and better patient outcomes.',
  pillars: ['Shared knowledge', 'Better decisions', 'Healthier vision'],
  startISO: '2026-11-17T19:00:00+05:30',
  endISO: '2026-11-17T21:30:00+05:30',
  dateLabel: 'Tuesday, 17 November 2026',
  dateShort: 'Tue, 17 Nov 2026',
  timeLabel: '7:00 pm to 9:30 pm',
  venue: 'Khaleez Hotel',
  place: 'Near Bharath Petroleum, Pottathepadi, Tirur',
  mapUrl: 'https://share.google/YuCjzRuf3dzXXP4h2',
  fee: 'Free',
  /** CME helpline printed on the brochure. */
  phoneDisplay: '+91 62380 85482',
  phoneTel: '+916238085482',
  emblem: '/wp-content/uploads/2026/11/samanvayam-emblem.webp',
  /** QR code for the brochure: opens https://sampadavr.com/cme/#register */
  qr: '/wp-content/uploads/2026/11/samanvayam-register-qr.svg',
  ogImage: '/wp-content/uploads/2026/11/samanvayam-og.png',
  /** Banner photo for the /cme/ hero. The hero falls back to plain Ink if the file is missing. */
  heroImage: '/wp-content/uploads/2026/11/samanvayam-hero.webp',
} as const;

/** "Who should attend", as printed on the brochure. */
export const CME_AUDIENCE = [
  'Ophthalmologists and retina specialists',
  'Diabetologists and physicians',
  'Nephrologists',
  'Paediatricians',
  'General practitioners',
] as const;

/** Options on the registration form, in display order. Nothing is preselected. */
export const FORM_SPECIALITIES = [
  'Ophthalmology',
  'Diabetology',
  'Paediatrics',
  'Nephrology',
  'General medicine',
  'General practice',
  'Other',
] as const;

/** Evening schedule from the brochure. `session` links a talk to the speaker with the same number. */
export const CME_SCHEDULE: ReadonlyArray<{
  time: string;
  title: string;
  note?: string;
  session?: 1 | 2 | 3;
}> = [
  { time: '7:00 – 7:10', title: 'Prayer' },
  { time: '7:10 – 7:15', title: 'Welcome speech' },
  { time: '7:15 – 7:25', title: 'Inauguration', note: 'Chief Guest: Dr Azim Ahdir, President, Tirur IMA' },
  { time: '7:25 – 7:35', title: 'Felicitations' },
  { time: '7:35 – 7:45', title: 'Scientific session 1', session: 1 },
  { time: '7:45 – 7:55', title: 'Scientific session 2', session: 2 },
  { time: '7:55 – 8:05', title: 'Scientific session 3', session: 3 },
  { time: '8:05 – 8:25', title: 'Discussion' },
  { time: '8:25 – 8:35', title: 'Vote of thanks' },
  { time: '8:35 – 9:30', title: 'Dinner and networking' },
];

/** Speakers in session order. Unconfirmed entries (confirmed: false) render as "To be announced". */
export const CME_SPEAKERS: ReadonlyArray<{
  confirmed: boolean;
  session: 1 | 2 | 3;
  name?: string;
  role?: string;
  org?: string;
  topic?: string;
  photo?: string;
}> = [
  {
    confirmed: true,
    session: 1,
    name: 'Dr Binesh Balachandran',
    role: 'HOD, Paediatrics and Neonatology',
    org: 'Aster MIMS Kottakkal',
    topic: 'The First 1000 Days and Beyond: Can Early-Life Metabolic Programming Influence Retinal Health?',
    photo: '/wp-content/uploads/2026/11/speaker-binesh.webp',
  },
  {
    confirmed: true,
    session: 2,
    name: 'Dr P. Hussain',
    role: 'Senior Consultant Physician',
    org: 'Tirur Nursing Home',
    topic: 'The New Era of Diabetes Management: A 2026 Update',
    photo: '/wp-content/uploads/2026/11/speaker-hussain.webp',
  },
  {
    confirmed: true,
    session: 3,
    name: 'Dr Sameera V V',
    role: 'Vitreoretinal Surgeon',
    org: 'Sampada VR Speciality Eye Care',
    topic: 'From Preemies to Adults: Timely Retinal Interventions in ROP and Systemic Diseases',
    photo: '/wp-content/uploads/2026/11/speaker-sameera.webp',
  },
];

/** The event is hidden from the homepage, and registration closes, the day after it ends (checked at build time; the site rebuilds daily). */
export const cmeIsOver = Date.now() > Date.parse(CME.endISO) + 24 * 60 * 60 * 1000;

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Add-to-calendar links, built at build time (no JS needed). */
export function cmeCalendar(siteUrl: string) {
  const start = stamp(CME.startISO);
  const end = stamp(CME.endISO);
  const title = `${CME.name}: ${CME.series}`;
  const where = `${CME.venue}, ${CME.place}`;
  const details = `${CME.theme}. ${CME.kind}. Venue map: ${CME.mapUrl}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sampada VR//Samanvayam 2026//EN',
    'BEGIN:VEVENT',
    'UID:samanvayam-2026@sampadavr.com',
    `DTSTAMP:${stamp(new Date(0).toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `LOCATION:${where}`,
    `DESCRIPTION:${details}`,
    `URL:${siteUrl}${CME.path}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const google =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(title)}&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}&location=${encodeURIComponent(where)}`;
  return { google, icsHref: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}
