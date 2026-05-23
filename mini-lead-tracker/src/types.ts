export type Stage =
  | 'Prospecting'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal'
  | 'Closed Won'
  | 'Closed Lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: Stage;
  value: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadFormData = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

export const STAGES: Stage[] = [
  'Prospecting',
  'Contacted',
  'Qualified',
  'Proposal',
  'Closed Won',
  'Closed Lost',
];

export const STAGE_CONFIG: Record<Stage, {
  color: string; bg: string; border: string; dot: string; barColor: string;
}> = {
  'Prospecting': {
    color: '#0f6e56', bg: '#e1f5ee', border: 'rgba(15,110,86,0.2)', dot: '#0f6e56', barColor: '#0f6e56',
  },
  'Contacted': {
    color: '#185fa5', bg: '#e6f1fb', border: 'rgba(24,95,165,0.2)', dot: '#185fa5', barColor: '#185fa5',
  },
  'Qualified': {
    color: '#854f0b', bg: '#faeeda', border: 'rgba(133,79,11,0.2)', dot: '#854f0b', barColor: '#854f0b',
  },
  'Proposal': {
    color: '#993556', bg: '#fbeaf0', border: 'rgba(153,53,86,0.2)', dot: '#993556', barColor: '#993556',
  },
  'Closed Won': {
    color: '#3b6d11', bg: '#eaf3de', border: 'rgba(59,109,17,0.2)', dot: '#3b6d11', barColor: '#3b6d11',
  },
  'Closed Lost': {
    color: '#a32d2d', bg: '#fcebeb', border: 'rgba(163,45,45,0.2)', dot: '#a32d2d', barColor: '#a32d2d',
  },
};

/* Avatar palette — mirrors AVATAR_COLORS from the HTML */
export const AVATAR_PALETTE: [string, string][] = [
  ['#ede9ff', '#5c4fff'],
  ['#e1f5ee', '#0f6e56'],
  ['#e6f1fb', '#185fa5'],
  ['#faeeda', '#854f0b'],
  ['#fbeaf0', '#993556'],
  ['#eaf3de', '#3b6d11'],
];
