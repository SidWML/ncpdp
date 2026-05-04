// DataSolutions.ai Design Tokens — NCPDP Corporate Blue palette
export const colors = {
  brand: {
    50:  '#E8F3F9',
    100: '#C6E0EC',
    200: '#8FC2D8',
    400: '#2D8AB5',
    500: '#1474A4',
    600: '#005C8D',
    700: '#004870',
    900: '#0F2E4E',
  },
  success: '#449055',
  warning: '#D97706',
  danger:  '#DC2626',
  info:    '#1474A4',
} as const;

export const radius = {
  sm:  '4px',
  md:  '6px',
  lg:  '8px',
  xl:  '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

export const shadow = {
  card:  '0 1px 2px rgb(0 0 0 / .04)',
  md:    '0 2px 8px rgb(0 0 0 / .06)',
  lg:    '0 4px 16px rgb(0 0 0 / .08)',
} as const;

export const spacing = {
  sidebar: '248px',
  topbar:  '56px',
} as const;
