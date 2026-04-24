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
  cssVariables: true,
  ...commonOverrides,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          contrastText: "var(--primary-contrast)",
        },
        secondary: {
          main: "var(--secondary)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
          contrastText: "var(--secondary-contrast)",
        },
        background: {
          default: "var(--background)",
          paper: "var(--background-paper)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          disabled: "var(--text-disabled)",
        },
      },
    },
  },
});
