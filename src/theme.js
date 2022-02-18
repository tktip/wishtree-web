import '@fontsource/pt-sans';
import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  containerMarginBase: (marginToAdd) => `calc(100vw - 100% + ${marginToAdd || '0px'})`,
  palette: {
    primary: {
      light: '#80add3',
      main: '#005aa7',
      dark: '#002d53',
    },
    secondary: {
      main: '#009bdf',
    },
    error: {
      main: '#e41f1a',
    },
    background: {
      default: '#eee',
    },
    common: {
      shaded: 'rgba(0,0,0,0.04)',
    },
  },
  typography: {
    fontFamily: 'PT Sans',
  },
  overrides: {
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  },
});

export default theme;
