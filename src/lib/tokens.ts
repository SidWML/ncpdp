// dataQ.ai Design Tokens — single source of truth for JS/TS usage
export const colors = {
  brand: {
    50:  '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    900: '#1E1B4B',
  },
  navy: {
    900: '#0A1128',
    800: '#0F1A3E',
    700: '#1B2B6B',
    600: '#243580',
  },
  success: '#10B981',
  warning: '#F59E0B',
  danger:  '#EF4444',
  info:    '#3B82F6',
  teal:    '#06B6D4',
  violet:  '#8B5CF6',
} as const;

export const radius = {
  sm:  '6px',
  md:  '10px',
  lg:  '14px',
  xl:  '18px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadow = {
  card:  '0 1px 3px 0 rgb(0 0 0 / .06), 0 1px 2px -1px rgb(0 0 0 / .06)',
  md:    '0 4px 6px -1px rgb(0 0 0 / .07), 0 2px 4px -2px rgb(0 0 0 / .07)',
  lg:    '0 10px 15px -3px rgb(0 0 0 / .08), 0 4px 6px -4px rgb(0 0 0 / .08)',
} as const;

export const spacing = {
  sidebar: '256px',
  topbar:  '64px',
} as const;
