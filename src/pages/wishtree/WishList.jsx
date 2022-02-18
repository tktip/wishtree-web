/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import {
 makeStyles, Dialog, DialogContent, DialogActions, DialogTitle, Box, IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import List, { ListItem } from '@trdk/style/List';
import Button from '@trdk/style/Button';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Close';
import DownloadIcon from '@material-ui/icons/GetApp';
import Input from '../../components/input';
import { deleteDream } from '../../services/wishtree-service';

function formatDate(dateString) {
  return format(new Date(dateString), 'PPP', { locale: nb });
}

const searchFilterTimeoutMs = 800;

const WishList = ({
  show, wishes, onClose, isAdmin, onWishIdDeleted,
}) => {
  const classes = useStyles();
  const [wishBeingDeleted, setWishBeingDeleted] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filteredWishes, setFilteredWishes] = useState(wishes);
  const [downloadLink, setDownloadLink] = useState('');
  const lastFilteredTime = useRef(new Date());

  useEffect(() => {
    lastFilteredTime.current = new Date();
    setTimeout(applyFilter, searchFilterTimeoutMs);
  }, [filterText, wishes]);

  useEffect(() => {
    setFilteredWishes(wishes);
    createCsvFile();
  }, [wishes, isAdmin]);

  function applyFilter() {
    if (new Date() - lastFilteredTime.current < searchFilterTimeoutMs) {
      return;
    }
    if (!filterText) {
      if (wishes.length !== filteredWishes.length) {
        setFilteredWishes(wishes);
      }
      return;
    }

    const lowerCaseFilter = filterText.toLowerCase();

    const newFilteredWishes = wishes.filter((w) => (
      (w.author && w.author.toLowerCase().includes(lowerCaseFilter))
        || (w.text && w.text.toLowerCase().includes(lowerCaseFilter))
    ));

    setFilteredWishes(newFilteredWishes);
  }

  async function confirmDeleteWish() {
    const result = await deleteDream(wishBeingDeleted.id);
    if (result.error) {
      // todo ragnar
      return;
    }

    onWishIdDeleted(wishBeingDeleted.id);
    setWishBeingDeleted(null);
  }

  function closePopup() {
    setFilterText('');
    onClose();
  }

  function createCsvFile() {
    if (isAdmin) {
      const csvHeaders = 'id,author,zipCode,category,text,createdTime\n';
      const csvData = wishes.map((wish) => `${wish.id},"${wish.author}",${wish.zipCode},"${wish.categoryName}","${wish.text}","${format(new Date(wish.createdAt), 'yyyy-MM-dd HH:mm:ss')}"\n`)
        .join('');

      const fileBlob = new Blob([csvHeaders, csvData], { type: 'text/plain', encoding: 'UTF-8' });

      if (downloadLink !== '') {
        window.URL.revokeObjectURL(downloadLink);
      }
      setDownloadLink(window.URL.createObjectURL(fileBlob));
    }
  }

  return (
    <Dialog open={show} onClose={closePopup} fullWidth>
      <DialogTitle className={classes.dialogTitle}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          Ønskeliste
          {isAdmin && (
          <a href={downloadLink} download="Ønsketre.csv" className={classes.plainLink}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DownloadIcon />}
            >
              Last ned
            </Button>
          </a>
          )}
        </Box>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>

        <Box width="100%" padding="0.5rem 1rem 1rem 1rem">
          <Input
            onChange={(newVal) => setFilterText(newVal.target.value)}
            variant="outlined"
            label="Søk etter tekst eller forfatter"
            className={classes.searchInput}
          />
        </Box>

        <List>
          {filteredWishes.map((wish, index) => (
            <ListItem
              style={{ padding: '0.5rem 1.5rem' }}
              primary={wish.text}
              secondary={`Fra ${wish?.author || 'anonym bruker'},${isAdmin ? ` postnr ${wish.zipCode},` : ''} ${formatDate(wish.createdAt)}`}
              key={index}
            >
              {wishBeingDeleted?.id !== wish.id && isAdmin && (
                <IconButton
                  disabled={!!wishBeingDeleted}
                  onClick={() => setWishBeingDeleted(wish)}
                  color="primary"
                  style={{ visibility: `${wishBeingDeleted ? 'hidden' : 'visible'}` }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
              {wishBeingDeleted?.id === wish.id && isAdmin && (
                <>
                  <IconButton onClick={confirmDeleteWish}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => setWishBeingDeleted(null)}>
                    <CancelIcon />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>

      </DialogContent>
      <DialogActions>
        <Button onClick={closePopup} color="primary">
          Skjul listen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

WishList.propTypes = {
  show: PropTypes.bool.isRequired,
  wishes: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onWishIdDeleted: PropTypes.func.isRequired,
};

const useStyles = makeStyles({
  dialogTitle: {
    padding: '1rem 1.5rem 0.5rem 1.5rem',
  },
  dialogContent: {
    padding: '0',
  },
  searchInput: {
    width: '100%',
  },
  plainLink: {
    textDecoration: 'none',
  },
});

export default WishList;
