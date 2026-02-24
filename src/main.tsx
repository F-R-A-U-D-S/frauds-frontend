import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const GlobalTheme = createTheme({
  typography: {
    fontFamily: 'Roboto'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#5328BC'//'#6b35cb'//'#5328BC'
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main:'#5328BC'
        },
      }
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
        <ThemeProvider theme={GlobalTheme} defaultMode="dark">
          <CssBaseline enableColorScheme/>
            <App />
        </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);