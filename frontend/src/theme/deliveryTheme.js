import { createTheme } from '@mui/material/styles';

const getDeliveryDesignTokens = (mode) => {
  const isLight = mode === 'light';

  return {
    palette: {
      mode,
      ...(isLight
        ? {
            primary: {
              main: '#6C35FF',
              light: '#EDE9FE',   // Soft tint for backgrounds
              dark: '#5120D1',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#8B5CF6',
              light: '#EDE9FE',
              dark: '#7C3AED',
              contrastText: '#ffffff',
            },
            background: {
              default: '#F7F9FC',
              paper: '#ffffff',
            },
            text: {
              primary: '#111827',
              secondary: '#6B7280',
              disabled: '#9CA3AF',
            },
            success: {
              main: '#10B981',
              light: '#ECFDF5',
              dark: '#047857',
              contrastText: '#ffffff',
            },
            warning: {
              main: '#F59E0B',
              light: '#FFFBEB',
              dark: '#B45309',
              contrastText: '#ffffff',
            },
            error: {
              main: '#EF4444',
              light: '#FFF5F5',
              dark: '#B91C1C',
              contrastText: '#ffffff',
            },
            info: {
              main: '#3B82F6',
              light: '#EFF6FF',
              dark: '#1D4ED8',
              contrastText: '#ffffff',
            },
            divider: '#E5E7EB',
          }
        : {
            primary: {
              main: '#8E66FF',
              light: 'rgba(142, 102, 255, 0.15)',
              dark: '#6C35FF',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#A78BFA',
              light: 'rgba(167, 139, 250, 0.15)',
              dark: '#8B5CF6',
              contrastText: '#ffffff',
            },
            background: {
              default: '#0F172A',  // Deeper navy for dark mode
              paper: '#1E293B',    // Slightly elevated surface
            },
            text: {
              primary: '#F1F5F9',
              secondary: '#94A3B8',
              disabled: '#475569',
            },
            success: {
              main: '#34D399',
              light: 'rgba(52, 211, 153, 0.15)',
              dark: '#059669',
              contrastText: '#ffffff',
            },
            warning: {
              main: '#FBBF24',
              light: 'rgba(251, 191, 36, 0.15)',
              dark: '#D97706',
              contrastText: '#1E293B',
            },
            error: {
              main: '#F87171',
              light: 'rgba(248, 113, 113, 0.15)',
              dark: '#DC2626',
              contrastText: '#ffffff',
            },
            info: {
              main: '#60A5FA',
              light: 'rgba(96, 165, 250, 0.15)',
              dark: '#2563EB',
              contrastText: '#ffffff',
            },
            divider: '#1E3A5F',
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      h1: { fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, fontSize: '1.875rem', letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
      h4: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.01em' },
      h5: { fontWeight: 700, fontSize: '1.125rem' },
      h6: { fontWeight: 700, fontSize: '1rem' },
      subtitle1: { fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.5 },
      subtitle2: { fontWeight: 600, fontSize: '0.8125rem' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
      caption: { fontSize: '0.75rem', lineHeight: 1.4 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      // 1 — subtle card
      isLight ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' : 'none',
      // 2 — elevated card
      isLight ? '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.4)',
      // 3 — modal / dialog
      isLight ? '0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)' : '0 8px 32px rgba(0,0,0,0.6)',
      // 4+ — not used
      'none','none','none','none','none','none','none','none','none',
      'none','none','none','none','none','none','none','none','none',
      'none','none','none','none','none'
    ],
    components: {
      // ── Buttons ────────────────────────────────────────────────────
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            padding: '7px 18px',
            fontSize: '0.875rem',
            letterSpacing: '0.01em',
            transition: 'background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
            '&:active': { transform: 'scale(0.98)' },
          },
          sizeLarge: { padding: '10px 24px', fontSize: '0.9375rem' },
          sizeSmall: { padding: '4px 12px', fontSize: '0.8125rem' },
          containedPrimary: {
            background: isLight
              ? 'linear-gradient(135deg, #7C4DFF 0%, #6C35FF 100%)'
              : 'linear-gradient(135deg, #8E66FF 0%, #7C4DFF 100%)',
            '&:hover': {
              background: isLight
                ? 'linear-gradient(135deg, #6C35FF 0%, #5120D1 100%)'
                : 'linear-gradient(135deg, #7C4DFF 0%, #6C35FF 100%)',
              transform: 'translateY(-1px)',
              boxShadow: isLight ? '0 4px 16px rgba(108,53,255,0.3)' : '0 4px 16px rgba(142,102,255,0.25)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': { borderWidth: '1.5px' },
          },
          outlinedPrimary: {
            borderColor: isLight ? '#E5E7EB' : '#2D3748',
            '&:hover': {
              borderColor: '#6C35FF',
              backgroundColor: isLight ? 'rgba(108,53,255,0.04)' : 'rgba(142,102,255,0.08)',
            },
          },
        },
      },
      // ── Card ───────────────────────────────────────────────────────
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: '16px',
            border: `1px solid ${isLight ? '#E9EEF6' : '#1E3A5F'}`,
            boxShadow: isLight
              ? '0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)'
              : 'none',
            backgroundColor: isLight ? '#ffffff' : '#1E293B',
            backgroundImage: 'none',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '20px 24px',
            '&:last-child': { paddingBottom: '20px' },
          },
        },
      },
      // ── Paper ──────────────────────────────────────────────────────
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight ? '#ffffff' : '#1E293B',
          },
          outlined: {
            borderColor: isLight ? '#E9EEF6' : '#1E3A5F',
          },
        },
      },
      // ── Chip ───────────────────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: '26px',
          },
          // Filled variants — soft tint backgrounds  
          filledPrimary: {
            backgroundColor: isLight ? '#EDE9FE' : 'rgba(142,102,255,0.18)',
            color: isLight ? '#6C35FF' : '#A78BFA',
          },
          filledSuccess: {
            backgroundColor: isLight ? '#ECFDF5' : 'rgba(52,211,153,0.18)',
            color: isLight ? '#047857' : '#34D399',
          },
          filledWarning: {
            backgroundColor: isLight ? '#FFFBEB' : 'rgba(251,191,36,0.18)',
            color: isLight ? '#B45309' : '#FBBF24',
          },
          filledError: {
            backgroundColor: isLight ? '#FFF5F5' : 'rgba(248,113,113,0.18)',
            color: isLight ? '#B91C1C' : '#F87171',
          },
          filledInfo: {
            backgroundColor: isLight ? '#EFF6FF' : 'rgba(96,165,250,0.18)',
            color: isLight ? '#1D4ED8' : '#60A5FA',
          },
          filledSecondary: {
            backgroundColor: isLight ? '#EDE9FE' : 'rgba(167,139,250,0.18)',
            color: isLight ? '#6D28D9' : '#A78BFA',
          },
        },
      },
      // ── Table ──────────────────────────────────────────────────────
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? '#F1F5F9' : '#1E3A5F'}`,
            padding: '14px 16px',
            fontSize: '0.875rem',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: isLight ? '#6B7280' : '#94A3B8',
            backgroundColor: isLight ? '#F8FAFC' : '#172033',
            padding: '12px 16px',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.025)',
            },
            '&:last-child td': { borderBottom: 'none' },
          },
        },
      },
      // ── Input / TextField ──────────────────────────────────────────
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            fontSize: '0.875rem',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isLight ? '#6C35FF' : '#8E66FF',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '1.5px',
            },
          },
          notchedOutline: {
            borderColor: isLight ? '#E5E7EB' : '#2D3748',
          },
          input: {
            padding: '10px 14px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            '&.Mui-focused': {
              color: isLight ? '#6C35FF' : '#8E66FF',
            },
          },
        },
      },
      // ── Select ────────────────────────────────────────────────────
      MuiSelect: {
        styleOverrides: {
          select: { fontSize: '0.875rem' },
        },
      },
      // ── AppBar ────────────────────────────────────────────────────
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(30,41,59,0.95)',
            backdropFilter: 'blur(12px)',
            color: isLight ? '#111827' : '#F1F5F9',
            boxShadow: 'none',
            borderBottom: `1px solid ${isLight ? '#E9EEF6' : '#1E3A5F'}`,
          },
        },
      },
      // ── Drawer ────────────────────────────────────────────────────
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#ffffff' : '#1E293B',
            borderRight: `1px solid ${isLight ? '#E9EEF6' : '#1E3A5F'}`,
            backgroundImage: 'none',
          },
        },
      },
      // ── Dialog ────────────────────────────────────────────────────
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '16px',
            backgroundImage: 'none',
            boxShadow: isLight
              ? '0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05)'
              : '0 20px 60px rgba(0,0,0,0.5)',
          },
        },
      },
      // ── Tabs ──────────────────────────────────────────────────────
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: '48px',
            padding: '12px 16px',
          },
        },
      },
      // ── Stepper ───────────────────────────────────────────────────
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontSize: '0.75rem',
            fontWeight: 500,
            '&.Mui-active': { fontWeight: 700 },
            '&.Mui-completed': { fontWeight: 600 },
          },
        },
      },
      // ── Alert ─────────────────────────────────────────────────────
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            fontSize: '0.875rem',
          },
        },
      },
      // ── Tooltip ───────────────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight ? '#1F2937' : '#374151',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: '6px',
            padding: '5px 10px',
          },
          arrow: {
            color: isLight ? '#1F2937' : '#374151',
          },
        },
      },
      // ── Switch ────────────────────────────────────────────────────
      MuiSwitch: {
        styleOverrides: {
          root: { padding: 8 },
          track: {
            borderRadius: 12,
            backgroundColor: isLight ? '#D1D5DB' : '#374151',
          },
          thumb: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          },
        },
      },
      // ── List ──────────────────────────────────────────────────────
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          },
        },
      },
      // ── Badge ─────────────────────────────────────────────────────
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 700,
            fontSize: '0.6875rem',
          },
        },
      },
      // ── Divider ───────────────────────────────────────────────────
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? '#E9EEF6' : '#1E3A5F',
          },
        },
      },
      // ── Skeleton ─────────────────────────────────────────────────
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
            borderRadius: '8px',
          },
        },
      },
      // ── Accordion ─────────────────────────────────────────────────
      MuiAccordion: {
        styleOverrides: {
          root: {
            '&:before': { display: 'none' },
            boxShadow: 'none',
          },
        },
      },
    },
  };
};

export default getDeliveryDesignTokens;
