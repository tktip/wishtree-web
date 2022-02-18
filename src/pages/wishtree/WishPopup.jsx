import {
 DialogContent, makeStyles, Typography, Dialog, DialogActions,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@trdk/style/Button';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export default function WishPopup({ wish = null, isOpen = false, onClose }) {
  const classes = useStyles();

  const formattedDate = wish ? format(new Date(wish.createdAt), 'PPP', { locale: nb }) : '';

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="body1" className={classes.mainText}>
          {wish?.text}
        </Typography>
        <Typography variant="body2" align="right">
          {`Fra ${wish?.author || 'anonym bruker'}, ${formattedDate}`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Lukk
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles({
  dialogContent: {
    padding: '1.5rem 1.5rem 0 1.5rem',
  },
  mainText: {
    marginBottom: '0.5rem',
    fontSize: '1rem',
  },
});

WishPopup.propTypes = {
  wish: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
