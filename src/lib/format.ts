// Small mapping helpers shared across pages.

export type Morandi = 'sage' | 'clay' | 'slate' | 'mauve' | 'sand' | 'fog';

export const gradient = (c: Morandi) => `g-${c}`;
export const avatarClass = (c: Morandi) => `a-${c}`;

// --- writing ---
export type WritingType =
  | 'reflective'
  | 'science-observation'
  | 'industry-observation'
  | 'opinion';

const WRITING_LABEL: Record<WritingType, string> = {
  reflective: 'Reflective',
  'science-observation': 'Science',
  'industry-observation': 'Industry',
  opinion: 'Opinion',
};
export const writingLabel = (t: WritingType) => WRITING_LABEL[t];
export const writingTagClass = (t: WritingType) => `t-${t}`;

// --- research status ---
export type ResearchStatus = 'under-review' | 'in-progress' | 'published';

const STATUS_LABEL: Record<ResearchStatus, string> = {
  'under-review': 'Under review',
  'in-progress': 'In training',
  published: 'Published',
};
const STATUS_TAG: Record<ResearchStatus, string> = {
  'under-review': 't-review',
  'in-progress': 't-training',
  published: 't-published',
};
export const statusLabel = (s: ResearchStatus) => STATUS_LABEL[s];
export const statusTagClass = (s: ResearchStatus) => STATUS_TAG[s];

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

// --- reading time ---
// Rough estimate for mixed CJK/Latin text: CJK counts by character (~400/min),
// everything else counts by word (~200/min). Good enough for a "~N min read" label.
export const readingTime = (raw: string): number => {
  const cjk = raw.match(/[一-鿿぀-ヿ]/g) ?? [];
  const nonCjk = raw.replace(/[一-鿿぀-ヿ]/g, ' ');
  const words = nonCjk.match(/[A-Za-z0-9']+/g) ?? [];
  const minutes = cjk.length / 400 + words.length / 200;
  return Math.max(1, Math.ceil(minutes));
};
