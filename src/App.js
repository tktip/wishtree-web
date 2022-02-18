/* eslint-disable react/jsx-filename-extension */
import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  CssBaseline, makeStyles,
 } from '@material-ui/core';
import React from 'react';
import {
  HashRouter, Route, Switch,
} from 'react-router-dom';
import theme from './theme';
import WishtreeMain from './pages/wishtree/WishtreeMain';
import Admin from './pages/admin/admin';

function App() {
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.siteContainer}>

        <HashRouter>
          <Switch>
            <Route
              exact
              path="/"
              component={WishtreeMain}
            />
            <Route
              exact
              path="/admin"
              component={Admin}
            />
          </Switch>
        </HashRouter>
      </div>
    </MuiThemeProvider>
  );
}

const useStyles = makeStyles({
  body: {
    backgroundColor: '#eee',
  },
  siteContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default App;
