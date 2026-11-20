/**
 * "Our Activities": single source of truth for /activities/ (English) and /ml/activities/ (Malayalam),
 * plus the homepage strip (src/components/ActivitiesStrip.astro).
 *
 * Model: a SERIES is a programme (Samanvayam, Myopia Clinic). An EDITION is one run of it (Samanvayam 2026).
 *   - frequency 'yearly'  : one edition per year, each with its own archive page (/activities/<series>/<year>/)
 *   - frequency 'monthly' : a running log, entries are listed on the series page (no page per entry)
 *   - frequency 'once'    : a series with a single edition
 * An edition only gets its own page when `page: true`.
 *
 * Every visitor-facing string is an { en, ml } pair. Malayalam is a first draft for native review.
 *
 * ADDING A NEW EDITION (e.g. Samanvayam 2027): add an entry to the series' `editions`, drop photos in
 * public/wp-content/uploads/<year>/<month>/ and list them in `photos`. Past editions are frozen here,
 * so /cme/ (src/data/cme.ts) can be repurposed for the next registration without touching the archive.
 */

export type Lang = 'en' | 'ml';
export type L = Record<Lang, string>;
export type Frequency = 'yearly' | 'monthly' | 'once';

export interface Photo { src: string; alt: L; caption?: L }
export interface Stat { value: string; label: L }
export interface ScheduleRow { time: string; title: L; note?: L; session?: number }
/** A YouTube video, shown click-to-play (nothing loads from YouTube until the visitor presses play). */
export interface Video {
  /** The id in the YouTube link: youtu.be/<youtubeId> */
  youtubeId: string;
  title: L;
  /** Self-hosted poster (webp under public/wp-content/uploads/...). */
  poster: string;
  /** ISO date the video was published on YouTube (for VideoObject JSON-LD). */
  uploadDate: string;
  /** ISO 8601 duration, e.g. 'PT5M57S'. */
  duration?: string;
}
export interface Speaker { session: number; name: string; role: string; org: string; topic: string; photo?: string }

export interface Edition {
  /** URL segment: '2026' for yearly, '2026-11' for monthly entries. */
  slug: string;
  title: L;
  startISO: string;
  endISO?: string;
  dateLabel: L;
  timeLabel?: L;
  theme?: L;
  venue?: L;
  mapUrl?: string;
  summary: L;
  /** Longer paragraph(s) for the archive page. */
  about?: L;
  /** Optional numbers, e.g. attendance. Shown as a strip on the archive page. Leave out until the figures are confirmed. */
  stats?: Stat[];
  audience?: L[];
  pillars?: L[];
  schedule?: ScheduleRow[];
  speakers?: Speaker[];
  /** Gallery. Empty until the photos are added. */
  photos: Photo[];
  /** Highlights video. Also shown on the series page while this is the newest edition with a video. */
  video?: Video;
  cover?: string;
  /** Build a dedicated archive page for this edition. */
  page: boolean;
  /** Registration link while the edition is upcoming. */
  registerHref?: string;
}

export interface Series {
  slug: string;
  name: L;
  /** Malayalam wordmark shown under the title on the archive page, optional. */
  nameAlt?: string;
  /** Round emblem shown in the archive page hero, optional. */
  emblem?: string;
  frequency: Frequency;
  tagline: L;
  description: L;
  audience: L;
  cover?: string;
  /** Hidden from the production build (still visible in `npm run dev`) until the copy is confirmed. */
  draft?: boolean;
  /** Shown on a series page that has no editions yet. */
  emptyNote?: L;
  editions: Edition[];
}

export const FREQUENCY_LABEL: Record<Frequency, L> = {
  yearly: { en: 'Yearly', ml: 'വാർഷികം' },
  monthly: { en: 'Monthly', ml: 'പ്രതിമാസം' },
  once: { en: 'One-time', ml: 'ഒറ്റത്തവണ' },
};

export const UI = {
  pageTitle: { en: 'Our Activities', ml: 'ഞങ്ങളുടെ പ്രവർത്തനങ്ങൾ' },
  pageLead: {
    en: 'Camps, clinics and programmes run by Sampada VR for the community and for fellow doctors, with the archive of what we have done so far.',
    ml: 'സമ്പദ VR സമൂഹത്തിനും സഹപ്രവർത്തകരായ ഡോക്ടർമാർക്കും വേണ്ടി നടത്തുന്ന ക്യാമ്പുകളും ക്ലിനിക്കുകളും പരിപാടികളും, ഇതുവരെ നടത്തിയവയുടെ ശേഖരവും.',
  },
  eyebrow: { en: 'Sampada VR in the community', ml: 'സമ്പദ VR സമൂഹത്തിൽ' },
  all: { en: 'All', ml: 'എല്ലാം' },
  allProgrammes: { en: 'All programmes', ml: 'എല്ലാ പരിപാടികളും' },
  upcoming: { en: 'Upcoming', ml: 'വരാനിരിക്കുന്നത്' },
  completed: { en: 'Completed', ml: 'കഴിഞ്ഞത്' },
  latest: { en: 'Latest', ml: 'ഏറ്റവും പുതിയത്' },
  editionsCount: { en: 'editions', ml: 'പതിപ്പുകൾ' },
  viewDetails: { en: 'View details', ml: 'വിശദാംശങ്ങൾ കാണുക' },
  viewAll: { en: 'View all activities', ml: 'എല്ലാ പ്രവർത്തനങ്ങളും കാണുക' },
  viewRecap: { en: 'See the recap', ml: 'വിവരങ്ങൾ കാണുക' },
  back: { en: 'All activities', ml: 'എല്ലാ പ്രവർത്തനങ്ങളും' },
  register: { en: 'Register', ml: 'രജിസ്റ്റർ ചെയ്യുക' },
  pastEditions: { en: 'Editions', ml: 'പതിപ്പുകൾ' },
  forWhom: { en: 'Who it is for', ml: 'ആർക്കുവേണ്ടി' },
  about: { en: 'About the programme', ml: 'പരിപാടിയെക്കുറിച്ച്' },
  theme: { en: 'Theme', ml: 'പ്രമേയം' },
  date: { en: 'Date', ml: 'തീയതി' },
  time: { en: 'Time', ml: 'സമയം' },
  venue: { en: 'Venue', ml: 'വേദി' },
  viewMap: { en: 'View on map', ml: 'മാപ്പിൽ കാണുക' },
  schedule: { en: 'Programme', ml: 'പരിപാടിക്രമം' },
  speakers: { en: 'Speakers', ml: 'പ്രഭാഷകർ' },
  session: { en: 'Session', ml: 'സെഷൻ' },
  gallery: { en: 'Photos', ml: 'ചിത്രങ്ങൾ' },
  highlightsVideo: { en: 'Watch the highlights', ml: 'ഹൈലൈറ്റുകൾ കാണുക' },
  playVideo: { en: 'Play video', ml: 'വീഡിയോ പ്ലേ ചെയ്യുക' },
  watchOnYouTube: { en: 'Watch on YouTube', ml: 'YouTube-ൽ കാണുക' },
  highlights: { en: 'At a glance', ml: 'ഒറ്റനോട്ടത്തിൽ' },
  nextTitle: { en: 'Next edition', ml: 'അടുത്ത പതിപ്പ്' },
  nextBody: {
    en: 'Samanvayam is held every year. Dates and details for the next edition will be announced here.',
    ml: 'സമന്വയം എല്ലാ വർഷവും നടത്തുന്നു. അടുത്ത പതിപ്പിന്റെ തീയതിയും വിവരങ്ങളും ഇവിടെ അറിയിക്കും.',
  },
  askTitle: { en: 'Want to know more?', ml: 'കൂടുതൽ അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?' },
  askBody: { en: 'Call or WhatsApp us for dates and details.', ml: 'തീയതിയും വിവരങ്ങളും അറിയാൻ ഞങ്ങളെ വിളിക്കുക അല്ലെങ്കിൽ വാട്സാപ്പ് ചെയ്യുക.' },
  noEditions: { en: 'No entries yet.', ml: 'ഇതുവരെ വിവരങ്ങൾ ചേർത്തിട്ടില്ല.' },
  tba: { en: 'To be announced', ml: 'ഉടൻ അറിയിക്കും' },
  closeLabel: { en: 'Close', ml: 'അടയ്ക്കുക' },
  toggle: { en: 'മലയാളത്തിൽ വായിക്കുക', ml: 'Read in English' },
} satisfies Record<string, L>;

const U = '/wp-content/uploads/2026/11';

/* ------------------------------------------------------------------ Samanvayam */

const samanvayam2026: Edition = {
  slug: '2026',
  title: { en: 'Samanvayam 2026', ml: 'സമന്വയം 2026' },
  startISO: '2026-11-17T19:00:00+05:30',
  endISO: '2026-11-17T21:30:00+05:30',
  dateLabel: { en: 'Tuesday, 17 November 2026', ml: '2026 നവംബർ 17, ചൊവ്വാഴ്ച' },
  timeLabel: { en: '7:00 pm to 9:30 pm', ml: 'വൈകുന്നേരം 7:00 മുതൽ 9:30 വരെ' },
  theme: { en: 'Where Specialties converge, care evolves', ml: 'വിവിധ വിഭാഗങ്ങൾ ഒന്നിക്കുമ്പോൾ, ചികിത്സ മെച്ചപ്പെടുന്നു' },
  venue: { en: 'Khaleez Hotel, Near Bharath Petroleum, Pottathepadi, Tirur', ml: 'ഖലീസ് ഹോട്ടൽ, തിരൂർ' },
  mapUrl: 'https://share.google/YuCjzRuf3dzXXP4h2',
  summary: {
    en: 'A multidisciplinary clinical update for doctors from ophthalmology, paediatrics and general medicine, held at Khaleez Hotel, Tirur.',
    ml: 'നേത്രരോഗം, ശിശുരോഗം, ജനറൽ മെഡിസിൻ വിഭാഗങ്ങളിലെ ഡോക്ടർമാർക്കായി തിരൂർ ഖലീസ് ഹോട്ടലിൽ നടത്തിയ ക്ലിനിക്കൽ അപ്ഡേറ്റ്.',
  },
  about: {
    en: 'Samanvayam brought together doctors from ophthalmology, paediatrics and general medicine to discuss the prevention, early detection and management of vision-threatening conditions. The meeting focused on practical clinical knowledge, timely referral, multidisciplinary collaboration and better patient outcomes.',
    ml: 'കാഴ്ചയെ ബാധിക്കുന്ന രോഗങ്ങളുടെ പ്രതിരോധം, നേരത്തെയുള്ള കണ്ടെത്തൽ, ചികിത്സ എന്നിവ ചർച്ച ചെയ്യാൻ നേത്രരോഗം, ശിശുരോഗം, ജനറൽ മെഡിസിൻ വിഭാഗങ്ങളിലെ ഡോക്ടർമാർ സമന്വയത്തിൽ ഒത്തുചേർന്നു. പ്രായോഗിക ക്ലിനിക്കൽ അറിവ്, സമയബന്ധിതമായ റഫറൽ, വിവിധ വിഭാഗങ്ങളുടെ സഹകരണം, രോഗികൾക്ക് മെച്ചപ്പെട്ട ഫലം എന്നിവയിലായിരുന്നു ഊന്നൽ.',
  },
  pillars: [
    { en: 'Shared knowledge', ml: 'പങ്കുവെക്കുന്ന അറിവ്' },
    { en: 'Better decisions', ml: 'മെച്ചപ്പെട്ട തീരുമാനങ്ങൾ' },
    { en: 'Healthier vision', ml: 'ആരോഗ്യമുള്ള കാഴ്ച' },
  ],
  audience: [
    { en: 'Ophthalmologists and retina specialists', ml: 'നേത്രരോഗ വിദഗ്ധരും റെറ്റിന സ്പെഷ്യലിസ്റ്റുകളും' },
    { en: 'Diabetologists and physicians', ml: 'പ്രമേഹരോഗ വിദഗ്ധരും ഫിസിഷ്യൻമാരും' },
    { en: 'Nephrologists', ml: 'നെഫ്രോളജിസ്റ്റുകൾ' },
    { en: 'Paediatricians', ml: 'ശിശുരോഗ വിദഗ്ധർ' },
    { en: 'General practitioners', ml: 'ജനറൽ പ്രാക്ടീഷണർമാർ' },
  ],
  schedule: [
    { time: '7:00 – 7:10', title: { en: 'Prayer', ml: 'പ്രാർത്ഥന' } },
    { time: '7:10 – 7:15', title: { en: 'Welcome speech', ml: 'സ്വാഗതം' } },
    {
      time: '7:15 – 7:25',
      title: { en: 'Inauguration', ml: 'ഉദ്ഘാടനം' },
      note: { en: 'Chief Guest: Dr Azim Ahdir, President, Tirur IMA', ml: 'മുഖ്യാതിഥി: Dr Azim Ahdir, പ്രസിഡന്റ്, തിരൂർ IMA' },
    },
    { time: '7:25 – 7:35', title: { en: 'Felicitations', ml: 'ആശംസകൾ' } },
    { time: '7:35 – 7:45', title: { en: 'Scientific session 1', ml: 'സയന്റിഫിക് സെഷൻ 1' }, session: 1 },
    { time: '7:45 – 7:55', title: { en: 'Scientific session 2', ml: 'സയന്റിഫിക് സെഷൻ 2' }, session: 2 },
    { time: '7:55 – 8:05', title: { en: 'Scientific session 3', ml: 'സയന്റിഫിക് സെഷൻ 3' }, session: 3 },
    { time: '8:05 – 8:25', title: { en: 'Discussion', ml: 'ചർച്ച' } },
    { time: '8:25 – 8:35', title: { en: 'Vote of thanks', ml: 'നന്ദി പ്രകാശനം' } },
    { time: '8:35 – 9:30', title: { en: 'Dinner and networking', ml: 'അത്താഴവും പരിചയപ്പെടലും' } },
  ],
  speakers: [
    {
      session: 1,
      name: 'Dr Binesh Balachandran',
      role: 'HOD, Paediatrics and Neonatology',
      org: 'Aster MIMS Kottakkal',
      topic: 'The First 1000 Days and Beyond: Can Early-Life Metabolic Programming Influence Retinal Health?',
      photo: `${U}/speaker-binesh.webp`,
    },
    {
      session: 2,
      name: 'Dr P. Hussain',
      role: 'Senior Consultant Physician',
      org: 'Tirur Nursing Home',
      topic: 'The New Era of Diabetes Management: A 2026 Update',
      photo: `${U}/speaker-hussain.webp`,
    },
    {
      session: 3,
      name: 'Dr Sameera V V',
      role: 'Vitreoretinal Surgeon',
      org: 'Sampada VR Speciality Eye Care',
      topic: 'From Preemies to Adults: Timely Retinal Interventions in ROP and Systemic Diseases',
      photo: `${U}/speaker-sameera.webp`,
    },
  ],
  /**
   * Gallery: add photos here once they are in public/wp-content/uploads/2026/11/, e.g.
   * { src: `${U}/samanvayam-2026-01.webp`, alt: { en: 'Dr Sameera presenting', ml: 'ഡോ. സമീറ അവതരിപ്പിക്കുന്നു' } }
   * The gallery section stays hidden while this list is empty.
   */
  photos: [],
  video: {
    youtubeId: 'bWMKsD5QoEw',
    title: { en: 'Samanvayam 2026 highlights', ml: 'സമന്വയം 2026 ഹൈലൈറ്റുകൾ' },
    poster: `${U}/samanvayam-2026-highlights.webp`,
    uploadDate: '2026-11-20T05:01:59-08:00',
    duration: 'PT5M57S',
  },
  cover: `${U}/samanvayam-hero.webp`,
  page: true,
};

const samanvayam: Series = {
  slug: 'samanvayam',
  name: { en: 'Samanvayam', ml: 'സമന്വയം' },
  nameAlt: 'സമന്വയം',
  emblem: `${U}/samanvayam-emblem.webp`,
  frequency: 'yearly',
  tagline: { en: 'Sampada CME: where specialties converge, care evolves', ml: 'സമ്പദ CME: വിവിധ വിഭാഗങ്ങൾ ഒന്നിക്കുമ്പോൾ, ചികിത്സ മെച്ചപ്പെടുന്നു' },
  description: {
    en: 'Samanvayam is our annual multidisciplinary clinical update (CME) for doctors. Ophthalmologists, paediatricians, physicians and other specialists meet to discuss the prevention, early detection and management of vision-threatening conditions, with a focus on timely referral and shared care.',
    ml: 'ഡോക്ടർമാർക്കായി ഞങ്ങൾ എല്ലാ വർഷവും നടത്തുന്ന ക്ലിനിക്കൽ അപ്ഡേറ്റ് (CME) ആണ് സമന്വയം. നേത്രരോഗ വിദഗ്ധർ, ശിശുരോഗ വിദഗ്ധർ, ഫിസിഷ്യൻമാർ തുടങ്ങിയവർ ഒത്തുചേർന്ന് കാഴ്ചയെ ബാധിക്കുന്ന രോഗങ്ങളുടെ പ്രതിരോധം, നേരത്തെയുള്ള കണ്ടെത്തൽ, ചികിത്സ എന്നിവ ചർച്ച ചെയ്യുന്നു.',
  },
  audience: { en: 'For doctors', ml: 'ഡോക്ടർമാർക്ക്' },
  cover: `${U}/samanvayam-hero.webp`,
  editions: [samanvayam2026],
};

/* --------------------------------------------------------------- Myopia Clinic */

/** DRAFT: placeholder copy. Confirm the description and add dated entries, then remove `draft: true`. */
const myopiaClinic: Series = {
  slug: 'myopia-clinic',
  name: { en: 'Myopia Clinic', ml: 'മയോപ്പിയ ക്ലിനിക്' },
  frequency: 'monthly',
  draft: true,
  tagline: { en: 'In-house monthly camp for children with short-sightedness', ml: 'ഹ്രസ്വദൃഷ്ടിയുള്ള കുട്ടികൾക്കായുള്ള പ്രതിമാസ ക്യാമ്പ്' },
  description: {
    en: 'Our in-house Myopia Clinic camp is held every month at Sampada VR, Tirur, for children and families concerned about short-sightedness.',
    ml: 'ഹ്രസ്വദൃഷ്ടിയെക്കുറിച്ച് ആശങ്കയുള്ള കുട്ടികൾക്കും കുടുംബങ്ങൾക്കുമായി തിരൂരിലെ സമ്പദ VR-ൽ എല്ലാ മാസവും നടത്തുന്ന ക്യാമ്പ്.',
  },
  audience: { en: 'For children and families', ml: 'കുട്ടികൾക്കും കുടുംബങ്ങൾക്കും' },
  emptyNote: {
    en: 'The next camp date will be announced here. Call or WhatsApp us to ask.',
    ml: 'അടുത്ത ക്യാമ്പിന്റെ തീയതി ഇവിടെ അറിയിക്കും. അറിയാൻ ഞങ്ങളെ വിളിക്കുക അല്ലെങ്കിൽ വാട്സാപ്പ് ചെയ്യുക.',
  },
  editions: [],
};

/* ---------------------------------------------------------------------- helpers */

const ALL_SERIES: Series[] = [samanvayam, myopiaClinic];
const showDrafts = import.meta.env.DEV;

export const SERIES: Series[] = ALL_SERIES.filter((s) => showDrafts || !s.draft);

export const pick = (v: L, lang: Lang) => v[lang] || v.en;
export const base = (lang: Lang) => (lang === 'ml' ? '/ml/activities/' : '/activities/');
export const seriesHref = (s: Series, lang: Lang) => `${base(lang)}${s.slug}/`;
export const editionHref = (s: Series, e: Edition, lang: Lang) => `${base(lang)}${s.slug}/${e.slug}/`;
/** Where a card for this edition should link: its archive page if it has one, else its series page. */
export const editionLink = (s: Series, e: Edition, lang: Lang) => (e.page ? editionHref(s, e, lang) : seriesHref(s, lang));

export const endOf = (e: Edition) => Date.parse(e.endISO ?? e.startISO);
/** Upcoming until the end of the day the edition finishes. Evaluated at build time; the site rebuilds daily. */
export const isUpcoming = (e: Edition) => Date.now() < endOf(e) + 24 * 60 * 60 * 1000;

export const sortedEditions = (s: Series) => [...s.editions].sort((a, b) => Date.parse(b.startISO) - Date.parse(a.startISO));

/** Every edition across all published series, newest first. Used by the homepage strip. */
export function recentEditions(limit?: number) {
  const all = SERIES.flatMap((series) => series.editions.map((edition) => ({ series, edition })));
  all.sort((a, b) => Date.parse(b.edition.startISO) - Date.parse(a.edition.startISO));
  return limit ? all.slice(0, limit) : all;
}

/** The newest edition of a series that has a highlights video, if any. */
export const latestVideoEdition = (s: Series) => sortedEditions(s).find((e) => e.video);

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** schema.org VideoObject for an edition's video. */
export function videoJsonLd(e: Edition, site: string) {
  const v = e.video!;
  return {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: pick(v.title, 'en'),
    description: pick(e.summary, 'en'),
    thumbnailUrl: [`${site}${v.poster}`],
    uploadDate: v.uploadDate,
    ...(v.duration ? { duration: v.duration } : {}),
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    contentUrl: youtubeWatchUrl(v.youtubeId),
  };
}

export function latestEdition(s: Series) {
  return sortedEditions(s)[0];
}
