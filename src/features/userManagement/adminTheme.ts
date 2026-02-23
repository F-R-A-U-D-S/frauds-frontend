import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1', // Indigo-500
        },
        secondary: {
            main: '#22d3ee', // Cyan-400
        },
        background: {
            default: '#020617', // Slate-950
            paper: 'rgba(2, 6, 23, 0.8)', // Glassy dark
        },
        text: {
            primary: '#cbd5e1', // Slate-300
            secondary: '#94a3b8', // Slate-400
        },
        error: {
            main: '#ef4444', // Red-500
        },
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
        h6: {
            fontWeight: 700,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(2, 6, 23, 0.8)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    color: '#e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#020617',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                },
                elevation1: {
                    boxShadow: 'none',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                },
                head: {
                    fontWeight: 600,
                    color: '#94a3b8',
                    backgroundColor: 'rgba(2, 6, 23, 0.5)',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03) !important',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    },
});

export default darkTheme;
