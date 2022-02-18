/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import {
 DialogContent, makeStyles,
  Dialog, DialogActions, DialogTitle,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import MaskedInput from 'react-text-mask';
import Button from '@trdk/style/Button';
import Input from '../../components/input';
import LoadingButton from '../../components/loading-button';
import CategoryPicker from './CategoryPicker';
import NotificationBox from '../../components/notification-box';

export default function NewWishPopup({
  isOpen,
  onClose,
  onSubmitDream,
  submitState,
  categories,
}) {
  const classes = useStyles();

  const [dreamText, setDreamText] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(null);

  const [missingDreamErrorMsg, setMissingDreamErrorMsg] = useState('');
  const [zipCodeErrorMsg, setZipCodeErrorMsg] = useState('');
  const [isCategoryMissing, setIsCategoryMissing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDreamText('');
      setZipCode('');
      setAuthor('');
      setCategory(null);
    }
  }, [isOpen]);

  async function submitDream() {
    let isError = false;
    if (!dreamText) {
      setMissingDreamErrorMsg('Ønske må fylles inn');
      isError = true;
    }
    if (!zipCode) {
      setZipCodeErrorMsg('Postnr må fylles inn');
      isError = true;
    } else if (zipCode.length !== 4) {
      setZipCodeErrorMsg('Postnr må være 4 siffer langt');
      isError = true;
    }
    if (!category) {
      setIsCategoryMissing(true);
      isError = true;
    }

    if (isError) {
      return;
    }

    onSubmitDream(dreamText, zipCode, author, category.id);
  }

  useEffect(() => {
    if (missingDreamErrorMsg && dreamText) {
      setMissingDreamErrorMsg('');
    }
    if (zipCodeErrorMsg && zipCode) {
      setZipCodeErrorMsg('');
    }
    if (isCategoryMissing && category) {
      setIsCategoryMissing(false);
    }
  }, [dreamText, zipCode, category]);

  useEffect(() => {
    if (!isOpen) {
      setDreamText('');
      setZipCode('');
      setAuthor('');
      setCategory(null);
      setIsCategoryMissing(false);
      setZipCodeErrorMsg('');
      setMissingDreamErrorMsg('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>
        Send inn ditt ønske!
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Input
          placeholder="Jeg skulle ønske..."
          className={classes.textInput}
          variant="outlined"
          label="Ditt ønske"
          onChange={(e) => setDreamText(e.target.value)}
          helperText={missingDreamErrorMsg}
          error={!!missingDreamErrorMsg}
          required
        />

        <Input
          className={classes.textInput}
          variant="outlined"
          label="Ditt postnummer"
          onChange={(e) => setZipCode(e.target.value)}
          helperText={zipCodeErrorMsg}
          error={!!zipCodeErrorMsg}
          InputProps={{ inputComponent: ZipMask, autoComplete: 'new-password' }}
          required
        />

        <Input
          className={classes.textInput}
          variant="outlined"
          label="Ditt navn (valgfritt)"
          onChange={(e) => setAuthor(e.target.value)}
        />

        <CategoryPicker
          allCategories={categories}
          selectedCategory={category}
          onCategorySelected={setCategory}
          isError={isCategoryMissing}
        />

        {(submitState === 'error' || submitState === 'already taken') && (
          <NotificationBox
            variant="error"
            outlined
            header="En feil oppsto"
            margin="1rem 0 0 0"
            text="Vi beklager, noe gikk galt under innsending av ønsket. Du kan prøve å sende inn på ny nå eller senere."
          />
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} color="primary">
          Lukk
        </Button>
        <LoadingButton
          isLoading={submitState === 'fetching'}
          onClick={submitDream}
          color="primary"
          variant="contained"
          disableElevation
        >
          Send inn
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

NewWishPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitDream: PropTypes.func.isRequired,
  submitState: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
};

function ZipMask(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      guide={false}
      mask={[/\d/, /\d/, /\d/, /\d/]}
      showMask
    />
  );
}
ZipMask.propTypes = {
  inputRef: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: '0.5rem 1.5rem 0 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: '28rem',
    },
    [theme.breakpoints.only('xs')]: {
      width: '20rem',
    },
    maxWidth: '100%',
  },
  dialogTitle: {
    paddingTop: '1.5rem',
    paddingBottom: '0.5rem',
  },
  dialogActions: {
    padding: '1rem 1.5rem 1rem 1.5rem',
  },
  mainText: {
    marginBottom: '0.5rem',
    fontSize: '1.15rem',
  },
  textInput: {
    marginBottom: '1rem',
  },
}));
