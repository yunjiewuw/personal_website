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
