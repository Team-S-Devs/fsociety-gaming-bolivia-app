import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { UserProvider } from "./contexts/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./AppRouter";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b3e8f",
    },
    secondary: {
      main: "#15acac",
    },
    success: {
      main: "#42d546",
    },
    warning: {
      main: "#f6c23e",
    },
  },
  typography: {
    allVariants: {
      color: "#FFF",
      wordWrap: "break-word",
      wordBreak: "break-word",
    },
    fontFamily: "Orbitron, sans-serif",
    fontSize: 18,
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
          background: "#1a064f",
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
    MuiTextField: {
      styleOverrides: {
        root: {
          fontSize: 40,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "#72f7f7",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#72f7f7",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          },
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
          color: "#fff",
          fontSize: "17px",
          "&.Mui-focused": {
            color: "#72f7f7",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#fff",
          background: "#1a064f",
          "&:hover": {
            backgroundColor: "#120438",
          },
          "&.Mui-selected": {
            backgroundColor: "#15acac",
            "&:hover": {
              backgroundColor: "#109797",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a064f",
        },
        paper: {
          backgroundColor: "#1a064f",
        },
        option: {
          "&:hover": {
            backgroundColor: "#120438",
          },
        },

        clearIndicator: {
          color: "#FFFFFF",
          "&:hover": {
            color: "#FF4081",
          },
        },
        popupIndicator: {
          color: "#FFFFFF",
          "&:hover": {
            color: "#FF4081",
          },
        },
        tag: {
          color: '#fff', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "#fff",
          borderColor: "#fff",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "#72f7f7",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#72f7f7",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
          },
        },
        icon: {
          color: "#fff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#72f7f7",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#72f7f7",
          },
          "& .MuiInputBase-input": {
            color: "white",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a064f",
          color: "#fff",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        },
        head: {
          fontWeight: "bold",
          backgroundColor: "#120438",
          color: "#fff",
        },
        body: {
          color: "#fff",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
        toolbar: {
          color: "#fff",
        },
        actions: {
          color: "#fff",
        },
        selectIcon: {
          color: "#fff",
        },
        select: {
          color: "#fff",
        },
        input: {
          color: "#fff",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "#120438",

          color: "#ffffff",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#120438",
          color: "#ffffff",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: "#120438",
          color: "#ffffff",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#3b3e8f",
          color: "#ffffff",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            backgroundColor: "#2c2f6b",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "#3b3e8f",
          color: "#ffffff",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c2f6b",
          color: "#ffffff",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-selected": {
            backgroundColor: "#15acac",
            color: "#ffffff",
          },
          "&:hover": {
            backgroundColor: "#15acac",
          },
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
          <AppRouter />
        </HelmetProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
