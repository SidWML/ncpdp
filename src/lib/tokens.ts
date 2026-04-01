// dataQ.ai Design Tokens — NCPDP Corporate Blue palette
export const colors = {
  brand: {
    50:  '#F0F7FF',
    100: '#DFEEFF',
    200: '#B8D5F5',
    400: '#5B9BD5',
    500: '#3A7EC8',
    600: '#2968B0',
    700: '#1E5690',
    900: '#0F2E4E',
  },
  success: '#059669',
  warning: '#D97706',
  danger:  '#DC2626',
  info:    '#2563EB',
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
