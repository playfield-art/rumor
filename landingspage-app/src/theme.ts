import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";
import SawtonIndustrialRegular from './assets/fonts/SawtonIndustrial-Regular.woff2';

export default createTheme({
  typography: {
    fontFamily: 'Sawton Industrial, Helvetica, Arial, sans-serif',
  },
  palette: {
    text: {
      primary: "#FFFFFF",
    },
    background: {
      default: "#253772",
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Sawton Industrial';
          src: url(${SawtonIndustrialRegular}) format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `,
    },
  },
});
