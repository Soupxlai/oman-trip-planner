import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#b45309' },
    secondary: { main: '#0891b2' },
    background: { default: '#fafaf9', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e7e5e4' } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
  },
})
