import {
 Box, makeStyles, Paper, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { login, logout } from '../../services/auth-service';
import LoggedInAdmin from './loggedin-admin';
import Input from '../../components/input';
import LoadingButton from '../../components/loading-button';
import useLocalStorage from '../../components/useLocalStorage';
import InformationBox from '../../components/information-box';

const Admin = () => {
  const classes = useStyles();

  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [adminUsername, setAdminUsername] = useLocalStorage('adminUsername');

  async function onLoginClick() {
    setIsLoggingIn(true);
    setLoginError(null);

    const {
      error, errorCode, username, ttlSeconds,
    } = await login(inputUsername, inputPassword);

    if (error) {
      setLoginError(`Feil ved innlogging: ${error} (kode ${errorCode})`);
    } else {
      setAdminUsername(username, new Date().getTime() + ttlSeconds * 1000);
    }

    setIsLoggingIn(false);
  }

  function onLogout() {
    logout();
    setAdminUsername(null);
  }

  return (
    <>
      <Box
        margin="auto"
        padding="1rem 1rem 3rem 1rem"
        display="flex"
        flexDirection="column"
        maxWidth="40rem"
      >
        <Typography variant="h1" className={classes.header}>
          Ønsketre-admin
        </Typography>

        {adminUsername && (
          <LoggedInAdmin
            username={adminUsername}
            onLogout={onLogout}
          />
        )}

        {!adminUsername && (
          <>
            <Typography variant="body1" className={classes.slightlyBiggerText}>
              Denne siden er kun for de som er administratorer av ønsketreet.
              Logg inn under med brukernavn og passord.
            </Typography>

            <Typography variant="body1" className={clsx(classes.slightlyBiggerText, classes.mt05)}>
              Når du er logget inn, vil du få tilgang til å administrere
              ønskene fra listen på hovedsiden.
            </Typography>

            <Paper className={classes.loginPaper}>
              <Typography variant="h3" style={{ fontSize: '1.5rem' }} color="primary">
                Logg inn
              </Typography>

              <Input
                placeholder="Brukernavn"
                className={classes.textInput}
                variant="outlined"
                label="Brukernavn"
                onChange={(e) => setInputUsername(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Passord"
                className={classes.textInput}
                variant="outlined"
                label="Passord"
                onChange={(e) => setInputPassword(e.target.value)}
                required
              />

              <LoadingButton
                color="primary"
                variant="contained"
                className={classes.loginButton}
                onClick={onLoginClick}
                isLoading={isLoggingIn}
              >
                Logg inn
              </LoadingButton>

              {loginError && (
                <InformationBox
                  variant="error"
                  showIcon
                  header="Feil"
                  text={loginError}
                />
              )}
            </Paper>
          </>
        )}
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    margin: '1rem 0',
    fontSize: '2.5rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem',
    },
  },
  mt05: {
    marginTop: '0.5rem',
  },
  widthFitContent: {
    width: 'fit-content',
  },
  slightlyBiggerText: {
    fontSize: '1.05rem',
  },
  loginPaper: {
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    margin: '3rem auto 0 auto',
    gap: '1rem',
  },
}));

export default Admin;
