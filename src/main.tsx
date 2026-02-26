import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type {} from '@mui/x-data-grid/themeAugmentation';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const GlobalTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          color: '#434245',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Roboto',
    body1: {
      color: '#434245'
    }
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6b35cb'//'#5328BC'
        },
        text: {
          primary: '#341A63',
          secondary:'#434245'
        }
      },
    },
    dark: {
      palette: {
        primary: {
          main:'#6b35cb'
        },
      }
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
        <ThemeProvider theme={GlobalTheme} defaultMode="light">
          <CssBaseline enableColorScheme/>
            <App />
        </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);