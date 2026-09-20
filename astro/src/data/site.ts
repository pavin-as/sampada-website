/** Shared site constants: single source of truth for header, cards, footer and CTAs. */
export const SITE = 'https://sampadavr.com';
export const PHONE_DISPLAY = '+91 91885 72412';
export const PHONE_TEL = '+919188572412';
export const MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Sampada+VR+Speciality+Eye+Care+LLP%2C+Railway+Station+Bypass+Rd%2C+Thazhepalam%2C+Tirur%2C+Kerala+676101';
export const INSTAGRAM_HANDLE = '@sampadavr';
export const INSTAGRAM_URL = 'https://www.instagram.com/sampadavr/';

/** The 8 dedicated treatment pages (retina first, cataract last), in the order they appear in the header dropdown, homepage grid and /treatments/. */
export const TREATMENT_ORDER = [
  'diabetic-retinopathy-treatment',
  'retinal-detachment-surgery',
  'intravitreal-injections',
  'vitrectomy',
  'oct-scan',
  'glaucoma-treatment',
  'eye-check-up',
  'cataract-surgery-tirur',
] as const;
