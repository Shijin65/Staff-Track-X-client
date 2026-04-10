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
      main: "#0055D4",
      light: "#3B82F6",
      dark: "#003EB3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7DD3FC",
    },
    background: {
      default: "#f3f6fa",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
  },
});
