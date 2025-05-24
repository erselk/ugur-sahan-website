export const colors = {
  primary: {
    brown: '#BA9881',
    dark: '#090B1E',
  },
  neutral: {
    white: '#FFFFFF',
    gray: {
      light: '#E0E0E0',
      medium: '#777777',
    },
  },
  gradients: {
    brown: {
      left: 'linear-gradient(115deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)',
      right: 'linear-gradient(115deg, rgba(186, 152, 129, 0.00) 0%, #BA9881 100%)',
      horizontal: 'linear-gradient(90deg, #BA9881 0%, rgba(186, 152, 129, 0.00) 100%)',
    },
  },
} as const;

export type ColorKey = keyof typeof colors; 