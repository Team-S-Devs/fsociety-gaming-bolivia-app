import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import Splash from "./pages/Splash";
import Error404 from "./pages/Error404";
import Authentication from "./pages/Authentication";
import { UserProvider } from "./contexts/UserContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#662483",
    },
    secondary: {
      main: "#604F83",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: { fontFamily: "Mulish, sans-serif" },
    h2: { fontFamily: "Mulish, sans-serif" },
    h3: { fontFamily: "Mulish, sans-serif" },
    h4: { fontFamily: "Mulish, sans-serif" },
    h5: { fontFamily: "Mulish, sans-serif" },
    h6: { fontFamily: "Mulish, sans-serif" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 0 6px rgba(0, 0, 0, 0.15)",
          background: "#fff",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          paddingLeft: "50px",
          paddingRight: "50px",
          borderRadius: "12px",
          textTransform: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "Mulish, sans-serif",
          textTransform: "capitalize",
          letterSpacing: 1.2,
          fontSize: 18,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: 40,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            background: "#561AD9 !important",
            color: "#fff",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "15px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "17px",
        },
      },
    },
  },
});

const App = () => {
  const helmetContext = {};

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <HelmetProvider context={helmetContext}>
          <BrowserRouter>
            <Routes>
              <Route path="/" Component={Splash} />
              <Route path="/auth" Component={Authentication} />
              <Route path="/error" Component={Error404} />
              <Route path="*" Component={Error404} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
