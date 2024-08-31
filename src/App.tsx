import { Route, Routes, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { auth, db } from "./utils/firebase-config";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { HelmetProvider } from "react-helmet-async";
import { UserInterface } from "./interfaces/interfaces";
import Splash from "./pages/Splash";
import Error404 from "./pages/Error404";
import Authentication from "./pages/Authentication";

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "::selection": {
          // color: "#561AD9",
          color: "#662483",
          background: "#fff",
        },
      },
    },
  },
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
    h1: {
      fontFamily: "Mulish, sans-serif",
    },
    h2: {
      fontFamily: "Mulish, sans-serif",
    },
    h3: {
      fontFamily: "Mulish, sans-serif",
    },
    h4: {
      fontFamily: "Mulish, sans-serif",
    },
    h5: {
      fontFamily: "Mulish, sans-serif",
    },
    h6: {
      fontFamily: "Mulish, sans-serif",
    },
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
  const [user, setUser] = useState<null | User>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (fireBaseUser) => {
      if (fireBaseUser) {
        setUser(fireBaseUser);

        onSnapshot(doc(db, "users", fireBaseUser.uid), (snapshot) => {
          const userInfo = snapshot.data() as UserInterface;
          setIsAdmin(userInfo.admin ?? false);
        });
      } else {
        setUser(null);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (fireBaseUser) => {
      if (fireBaseUser) {
        setUser(fireBaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const helmetContext = {};

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
