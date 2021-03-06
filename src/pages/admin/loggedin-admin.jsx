import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, Typography, FormGroup, FormControlLabel, Switch, CircularProgress,
} from '@material-ui/core';
import Button from '@trdk/style/Button';
import ArrowLeftIcon from '@material-ui/icons/ArrowBack';
import clsx from 'clsx';
import { Refresh } from '@material-ui/icons';
import { fetchTreeStatus, maxNumberOfFreeLeaves, updateTreeStatus } from '../../services/wishtree-service';
import LoadingButton from '../../components/loading-button';
import InformationBox from '../../components/information-box';

export default function LoggedInAdmin({ username, onLogout }) {
  const classes = useStyles();

  const [isTreeActive, setIsTreeActive] = useState(null);
  const [treeWishCounts, setTreeWishCounts] = useState(null);
  const [isFetchError, setIsFetchError] = useState(false);
  const [newIsTreeActive, setNewIsTreeActive] = useState(null);

  const [isUpdatingTree, setIsUpdatingTree] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  useEffect(getTreeStatus, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getTreeStatus() {
    setIsFetchError(false);
    const {
      error, errorCode, isOpen, wishCounts,
    } = await fetchTreeStatus();
    if (error) {
      setIsFetchError(`Feil: ${error} (kode ${errorCode})`);
    } else {
      setIsTreeActive(isOpen);
      setNewIsTreeActive(isOpen);
      setTreeWishCounts(wishCounts);
    }
  }

  async function updateTree() {
    setUpdateSuccess(false);
    setUpdateError(false);
    setIsUpdatingTree(true);

    const { error, errorCode, isOpen } = await updateTreeStatus(newIsTreeActive);
    setIsUpdatingTree(false);

    if (error) {
      setUpdateError(`Feil ved oppdatering: ${error} (kode ${errorCode})`);
      if (errorCode === 401) {
        onLogout();
      }
    } else {
      setUpdateSuccess(true);
      setNewIsTreeActive(isOpen);
      setIsTreeActive(isOpen);
    }
  }

  if (isFetchError) {
    return (
      <InformationBox
        variant="error"
        outlined
        header="En feil oppsto"
        margin="1rem auto"
        text="Vi beklager, noe gikk galt under henting av data. Pr??v igjen senere."
        className={classes.errorBox}
        buttonAction={getTreeStatus}
        buttonText="Pr??v igjen"
        buttonIcon={<Refresh />}
      />
    );
  }

  return (
    <>
      <Typography variant="body1" align="left" className={classes.slightlyBiggerText}>
        {`Du er logget inn med brukernavn ${username}.`}
      </Typography>
      <Typography variant="body1" align="left" className={clsx(classes.slightlyBiggerText, classes.mt05)}>
        Du f??r n?? mulighet til ?? slette ??nsker, og til ?? eksportere de til fil,
        n??r du velger &quot;se ??nskene som liste&quot; fra hovedsiden.
      </Typography>

      <Button
        href="/trondheimsdrommer"
        variant="contained"
        color="primary"
        startIcon={<ArrowLeftIcon />}
        className={classes.loginButton}
      >
        G?? til ??nsketreet
      </Button>

      <Button
        onClick={onLogout}
        variant="outlined"
        color="primary"
        className={classes.widthFitContent}
      >
        Logg ut
      </Button>

      <Typography variant="h2" className={classes.h2}>
        Tall
      </Typography>

      {treeWishCounts !== null ? (
        <>
          <Typography variant="body1">
            <b>{treeWishCounts.shownWishes}</b>
            {' '}
            ??nsker tatt og synlig
          </Typography>
          <Typography variant="body1">
            <b>{treeWishCounts.totalWishes}</b>
            {' '}
            ??nsker maks (tatt + ledig)
          </Typography>
          <Typography variant="body1">
            <b>{treeWishCounts.archivedWishes}</b>
            {' '}
            ??nsker arkivert
          </Typography>

          <Typography variant="body1" style={{ marginTop: '1rem' }}>
            {`De eldste ??nskene blir arkivert n??r antallet tatte ??nsker er 
            ${maxNumberOfFreeLeaves} mindre enn maks antall.
            P?? denne m??ten er det alltid noen ledige blader for de som ??nsker
            ?? plassere et ??nske selv. Arkiverte ??nsker vises ikke i treet, men er fremdeles
            i listen.`}
          </Typography>
          <Typography variant="body1" style={{ marginTop: '1rem' }}>
            {`Det vises alltid ${maxNumberOfFreeLeaves} ledige ??nsker p?? treet.`}
          </Typography>
        </>
      ) : (
        <CircularProgress />
      )}

      <Typography variant="h2" className={classes.h2}>
        Verkt??y
      </Typography>

      {isTreeActive !== null ? (
        <>
          <Typography variant="body1">
            Du kan skru av/p?? muligheten for folk til ?? legge til ??nsker. Selv om treet er lukket
            for nye ??nsker, vil de eksisterende ??nskene forbli synlige.
          </Typography>

          <FormGroup className={classes.activeToggle}>
            <Typography variant="body1">
              Godta nye ??nsker:
            </Typography>
            <FormControlLabel
              control={(
                <Switch
                  checked={newIsTreeActive || false}
                  onChange={(e) => setNewIsTreeActive(e.target.checked)}
                />
              )}
              label={newIsTreeActive ? 'Ja' : 'Nei'}
            />
          </FormGroup>

          {newIsTreeActive !== isTreeActive && (
            <LoadingButton
              isLoading={isUpdatingTree}
              variant="contained"
              color="primary"
              style={{ width: 'fit-content' }}
              onClick={updateTree}
            >
              Lagre
            </LoadingButton>
          )}

          {updateError && (
            <InformationBox variant="error" showIcon text={updateError} margin="0.5rem 0 0 0" />
          )}
          {updateSuccess && (
            <InformationBox
              variant="success"
              showIcon
              text="Treet er oppdatert"
              duration={5000}
            />
          )}
        </>
      ) : (
        <CircularProgress />
      )}

      <div className={classes.singleLinePre}>
        <Typography variant="h2" className={classes.h2}>
          Annet
        </Typography>
        <Typography variant="body1" className={classes.singleLineText}>
          For ?? endre tekst, gj??r endringer i
          {' '}
          <pre>texts.json</pre>
          {' '}
          i client-repoet, og bygg prosjektet p?? nytt.
        </Typography>
        <Typography variant="body1" className={classes.singleLineText}>
          For ?? endre farger p?? blad, gj??r endringer i databasetabellen
          {' '}
          <pre>categories</pre>
          .
        </Typography>
        <Typography variant="body1" className={classes.singleLineText}>
          For ?? legge til flere admin-brukere, legg til brukernavn og passord i
          {' '}
          <pre>cfg.yml</pre>
          {' '}
          i server-repoet.
        </Typography>
      </div>
    </>
  );
}

LoggedInAdmin.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const useStyles = makeStyles(() => ({
  h2: {
    fontSize: '1.5rem',
    marginTop: '2rem',
    marginBottom: '0.5rem',
  },
  mt05: {
    marginTop: '0.5rem',
  },
  loginButton: {
    width: 'fit-content',
    margin: '1rem 0',
  },
  widthFitContent: {
    width: 'fit-content',
  },
  slightlyBiggerText: {
    fontSize: '1.05rem',
  },
  activeToggle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
  },
  singleLinePre: {
    '&>p>pre': {
      display: 'inline',
    },
  },
}));
