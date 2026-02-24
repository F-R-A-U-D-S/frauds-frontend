import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const GlobalTheme = createTheme({
    colorSchemes: {
      dark:true,
    },
    palette: {
      primary: {
        main: '#3619a3cc',
        //contrastText: '#FFFFFF'
      },
    },
  });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
        <ThemeProvider theme={GlobalTheme} defaultMode="system">
          <CssBaseline enableColorScheme/>
            <App />
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);