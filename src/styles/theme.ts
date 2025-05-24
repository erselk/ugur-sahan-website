export const colors = {
  primary: {
    dark: '#090B1E', // Hero background
    light: '#FFFFFF', // White text
  },
  accent: {
    brown: '#BA9881', // Contact button and rectangle
  },
} as const;

export const theme = {
  colors,
  borderRadius: {
    sm: '20px',
    md: '63px',
  },
} as const; 