/**
 * Icon and tint for each specialty, keyed by the stored specialization name.
 * Hues are drawn from the cool end of the spectrum to sit with every palette.
 */
const HUES = ['#6366F1', '#8B5CF6', '#06B6D4', '#0EA5E9', '#14B8A6', '#EC4899', '#3B82F6', '#A855F7'];

const ICONS: Record<string, string> = {
  'General Practitioner (GP)': 'stethoscope',
  Cardiologist: 'heart-pulse',
  Pediatrician: 'baby-face-outline',
  'Orthopedic Surgeon': 'bone',
  Gynecologist: 'gender-female',
  'Obstetrician (OB)': 'human-pregnant',
  Dermatologist: 'face-woman-shimmer-outline',
  Endocrinologist: 'test-tube',
  Neurologist: 'brain',
  Psychiatrist: 'head-heart-outline',
  Gastroenterologist: 'stomach',
  Pulmonologist: 'lungs',
  Oncologist: 'ribbon',
  Ophthalmologist: 'eye-outline',
  Urologist: 'water-outline',
};

const ORDER = Object.keys(ICONS);

export const specialtyIcon = (name?: string) => (name && ICONS[name]) || 'doctor';

export const specialtyHue = (name?: string) => {
  const i = name ? ORDER.indexOf(name) : -1;
  return HUES[(i < 0 ? 0 : i) % HUES.length];
};

/** Hex colour with alpha, for tinted tile backgrounds. */
export const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
};

/** "General Practitioner (GP)" -> "General Practitioner"; used for compact labels. */
export const shortSpecialty = (name?: string) => (name ?? '').replace(/\s*\([^)]*\)\s*$/, '');
