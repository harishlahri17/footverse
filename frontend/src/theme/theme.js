import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => {
  const isLight = mode === 'light';

  return {
    palette: {
      mode,
      primary: {
        main: '#4F46E5', // Indigo
        light: '#818CF8',
        dark: '#3730A3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#F43F5E', // Rose/Red for wishlists, alerts
        light: '#FB7185',
        dark: '#E11D48',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10B981', // Green for in-stock, success
        light: '#34D399',
        dark: '#059669',
      },
      error: {
        main: '#EF4444',
      },
      warning: {
        main: '#F59E0B',
      },
      background: {
        default: isLight ? '#F8F9FC' : '#0F172A',
        paper: isLight ? '#FFFFFF' : '#1E293B',
      },
      text: {
        primary: isLight ? '#111827' : '#F9FAFB',
        secondary: isLight ? '#6B7280' : '#9CA3AF',
      },
      divider: isLight ? '#E5E7EB' : '#334155',
    },
    typography: {
      fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.01em' },
      h3: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
      h4: { fontWeight: 600, fontSize: '1.25rem' },
      h5: { fontWeight: 600, fontSize: '1.1rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontWeight: 600, fontSize: '1rem' },
      subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
      body1: { fontSize: '0.95rem', lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', lineHeight: 1.43 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 24px',
          },
          sizeLarge: {
            padding: '12px 32px',
            fontSize: '1rem',
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: '#4338CA',
            }
          }
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: isLight ? '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)' : 'none',
            border: `1px solid ${isLight ? '#E5E7EB' : '#334155'}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
            '& fieldset': {
              borderColor: isLight ? '#E5E7EB' : '#334155',
            },
            '&:hover fieldset': {
              borderColor: '#818CF8 !important',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4F46E5 !important',
            }
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
            color: isLight ? '#111827' : '#F9FAFB',
            borderBottom: `1px solid ${isLight ? '#E5E7EB' : '#334155'}`,
          },
        },
      },
    },
  };
};

export default getDesignTokens;
