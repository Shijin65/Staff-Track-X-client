import { createTheme } from "@mui/material/styles";

const commonOverrides = {
  typography: {
    fontFamily: "Inter, sans-serif",
    button: {
      textTransform: "none" as const,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonOverrides,
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1E40AF",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#60A5FA",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
  },
});
