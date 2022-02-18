import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  makeStyles, Typography, useMediaQuery, Popover, Box, CircularProgress,
 } from '@material-ui/core';
import Button from '@trdk/style/Button';
import React, {
 useEffect, useMemo, useRef, useState,
} from 'react';
import PlusIcon from '@material-ui/icons/Add';
import { useTheme } from '@material-ui/core/styles';
import TreeSvg from './TreeSvg';
import Leaf from './Leaf';
import WishPopup from './WishPopup';
import WishList from './WishList';
import NewWishPopup from './NewWishPopup';
import {
  fetchAllWishes, submitDream, fetchCategories, fetchTreeStatus,
} from '../../services/wishtree-service';
import NotificationBox from '../../components/notification-box';
import texts from '../../texts.json';
import useLocalStorage from '../../components/useLocalStorage';

function WishtreeMain() {
  const classes = useStyles();
  const theme = useTheme();
  const [adminUsername] = useLocalStorage('adminUsername');

  const [leaves, setLeaves] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [takenLeaves, setTakenLeaves] = useState([]);
  const [openedWish, setOpenedWish] = useState(null);
  const [isWishpopupOpen, setisWishPopupOpen] = useState(false);
  const [isMakingNewDream, setIsMakingNewDream] = useState(false);
  const [newDreamWish, setNewDreamWish] = useState(null);
  const [submitDreamState, setSubmitDreamState] = useState('initial');
  const [submittedLeaf, setSubmittedLeaf] = useState(null);
  const [isViewingList, setIsViewingList] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [takenLeafSizeMultiplier, setTakenLeafSizeMultiplier] = useState(0.1);
  const [leafSize, setLeafSize] = useState(12);
  const [isTreeOpen, setIsTreeOpen] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const newTakenLeaves = leaves.filter((leaf) => leaf.isTaken);

    if (newTakenLeaves.length === 0) {
      setTakenLeafSizeMultiplier(0.1);
    } else if (newTakenLeaves.length <= 40) {
      setTakenLeafSizeMultiplier(1.5);
    } else {
      setTakenLeafSizeMultiplier(1.5);
    }

    const newLeafSize = calculateLeafSize();
    setLeafSize(newLeafSize);

    setTakenLeaves(newTakenLeaves);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaves]);

  const colorIdsToColor = useMemo(() => {
    const idsToColor = {};

    if (hasFetchedData && !fetchError) {
      categories.forEach((category) => {
        idsToColor[category.id] = category.description;
      });
    }

    return idsToColor;
  }, [categories, fetchError, hasFetchedData]);

  async function loadInitialData() {
    const fetchedTreeState = await fetchTreeStatus();
    if ('error' in fetchedTreeState) {
      setFetchError(true);
      return;
    }
    setIsTreeOpen(fetchedTreeState.isOpen);

    const [fetchedWishes, fetchedCategories] = await Promise.all([
      fetchAllWishes(fetchedTreeState.isOpen), fetchCategories(),
    ]);

    if ('error' in fetchedWishes || 'error' in fetchedCategories) {
      setFetchError(true);
      return;
    }
    setLeaves(fetchedWishes);
    setCategories(fetchedCategories);
    setHasFetchedData(true);
  }

  function onWishIdDeleted(deletedWishId) {
    const newLeaves = leaves.filter((l) => l.id !== deletedWishId);
    setLeaves(newLeaves);
  }

  const isMdOrSmaller = useMediaQuery(theme.breakpoints.down('md'));
  const isXsOrSmaller = useMediaQuery('(max-width:715px)');
  const isTiny = useMediaQuery('(max-width:510px)');
  const isXtraTiny = useMediaQuery('(max-width:370px)');

  const isMdOrSmallerHeight = useMediaQuery('(max-height:930px)');
  const isXsOrSmallerHeight = useMediaQuery('(max-height:830px)');
  const isXxsOrSmallerHeight = useMediaQuery('(max-height:700px)');
  const isXxxsOrSmallerHeight = useMediaQuery('(max-height:670px)');
  const isSmallestHeight = useMediaQuery('(max-height:610px)');
  const isSmallestHeightHideAllText = useMediaQuery('(max-height:500px)');

  function getMaxHeight() {
    if (isXtraTiny) {
      return '306px';
    }
    if (isTiny || isXxsOrSmallerHeight) {
      return '360px';
    }
    if (isXsOrSmaller || isXsOrSmallerHeight) {
      return '500px';
    }
    if (isMdOrSmaller || isMdOrSmallerHeight) {
      return '700px';
    }
    return '750px';
  }

  function calculateLeafSize() {
    if (isXsOrSmaller || isXsOrSmallerHeight) {
      if (leaves.length > 500) {
        return 7;
      }
      return 12;
    }
    if (leaves.length > 500) {
      return 12;
    }
    if (leaves.length > 250) {
      return 16;
    }
    return 20;
  }

  function onWishClicked(wish) {
    if (wish.isTaken) {
      setOpenedWish(wish);
      setisWishPopupOpen(true);
    } else {
      openMakeDreamPopup(wish);
    }
  }

  function closeOpenWish() {
    setisWishPopupOpen(false);
    setTimeout(() => {
      setOpenedWish(null);
    }, 250);
  }

  function openMakeDreamPopup(wish) {
    setSubmitDreamState('initial');
    setIsMakingNewDream(true);
    setNewDreamWish(wish);
  }

  async function onSubmitDream(dreamText, zipCode, author, categoryId) {
    setSubmitDreamState('fetching');
    const result = await submitDream(newDreamWish?.id, dreamText, zipCode, author, categoryId);
    if ('error' in result) {
      if (result.leafTaken) {
        setSubmitDreamState('already taken');
      } else {
        setSubmitDreamState('error');
      }
    } else {
      setSubmitDreamState('success');
      setIsMakingNewDream(false);
      setSubmittedLeaf(result);
      const shownLeafIndex = leaves.findIndex((l) => l.id === result.id);

      if (shownLeafIndex >= 0) {
        const newLeaves = [...leaves];
        newLeaves[shownLeafIndex] = result;
        setLeaves(newLeaves);
      } else {
        setLeaves([...leaves, result]);
      }
    }
  }

  function onCloseSubmitHighlight() {
    setSubmitDreamState('initial');
    setSubmittedLeaf(null);
  }

  return (
    <>
      {submittedLeaf && (
        <div className={classes.grayOverlay} />
      )}

      <WishList
        show={isViewingList}
        onClose={() => setIsViewingList(false)}
        wishes={takenLeaves}
        isAdmin={!!adminUsername}
        onWishIdDeleted={onWishIdDeleted}
      />

      <Typography variant="h1" className={classes.header}>
        {texts.mainTitle}
      </Typography>

      {!isSmallestHeight && (
        <>
          {isTreeOpen === null && (
            <div className={classes.descriptionPlaceholder} />
          )}

          {isTreeOpen !== null && (
            <Typography variant="body1" className={classes.descriptionText}>
              {isTreeOpen ? texts.introText : texts.introTextTreeClosed}
            </Typography>
          )}
        </>
      )}

      {!fetchError && (
        <>
          <div className={classes.treeContainer}>
            <TreeSvg height={getMaxHeight()} fill="#404a4e" />

            {(!hasFetchedData) && (
              <Box>
                <CircularProgress
                  size={80}
                  className={classes.loadingSpinner}
                  color="primary"
                />
              </Box>
            )}

            {leaves.map((leaf) => (
              <Leaf
                x={`${leaf.x - 1}%`}
                y={`${leaf.y }%`}
                color={leaf.isTaken ? colorIdsToColor[leaf.categoryId] : null}
                rotateDeg={leaf.rotateDeg}
                isTaken={!!leaf.isTaken}
                leafSizePx={leafSize}
                key={leaf.id}
                onClick={() => onWishClicked(leaf)}
                isHighlighted={leaf.id === submittedLeaf?.id}
                takenSizeMultiplier={takenLeafSizeMultiplier}
              />
            ))}

            <LeafHighlight
              show={!!submittedLeaf}
              x={takenLeafSizeMultiplier === 2 ? submittedLeaf?.x : submittedLeaf?.x + 1.25}
              y={takenLeafSizeMultiplier === 2 ? submittedLeaf?.y : submittedLeaf?.y + 0.25}
              onClose={onCloseSubmitHighlight}
            />
          </div>

          <div className={clsx(
            classes.bottomContainer,
            (isXxxsOrSmallerHeight && isXsOrSmaller) ? classes.bottomContainerSmallScreen : '',
            isSmallestHeight ? classes.bottomContainerTinyScreen : '',
            (isXxxsOrSmallerHeight && !isXsOrSmaller && !isSmallestHeight) ? classes.bottomContainerTabletScreen : '',
          )}
          >
            <div className={classes.bottomInnerContainer}>
              {hasFetchedData && isTreeOpen !== null && (
                <div className={clsx(classes.buttonsContainer, isTiny ? classes.directionColumn : '')}>
                  {isTreeOpen && (
                    <Button
                      startIcon={<PlusIcon />}
                      variant="contained"
                      color="primary"
                      className={classes.actionButton}
                      onClick={() => openMakeDreamPopup(null)}
                    >
                      Skriv inn ønsket ditt
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => setIsViewingList(true)}
                    className={classes.actionButton}
                    style={{ background: '#edf6ff' }}
                  >
                    Se ønskene som liste
                  </Button>
                </div>
              )}

              {!isSmallestHeightHideAllText && (
                <Typography variant="body1" align="center" className={classes.bottomText}>
                  {`${texts.bottomText1} `}
                  {texts.bottomLinkText && (
                    <a href={texts.bottomLinkUrl}>{texts.bottomLinkText}</a>
                  )}
                  {texts.bottomText2 && (
                    ` ${texts.bottomText2}`
                  )}
                </Typography>
              )}
            </div>
          </div>
        </>
      )}

      {fetchError && (
        <NotificationBox
          variant="error"
          outlined
          header="En feil oppsto"
          margin="1rem auto"
          text="Vi beklager, noe gikk galt under henting av ønsker. Prøv igjen senere."
          className={classes.errorBox}
        />
      )}

      <WishPopup
        wish={openedWish}
        isOpen={isWishpopupOpen}
        onClose={closeOpenWish}
      />

      <NewWishPopup
        wish={newDreamWish}
        isOpen={isMakingNewDream}
        onSubmitDream={onSubmitDream}
        submitState={submitDreamState}
        categories={categories}
        onClose={() => setIsMakingNewDream(false)}
      />
    </>
  );
}

const LeafHighlight = ({
 show, x, y, onClose,
}) => {
  const classes = useStyles();
  const submittedLeafHighlight = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (show) {
      setAnchorEl(submittedLeafHighlight.current);
    }
  }, [show]);

  return (
    show && (
      <>
        <div
          ref={submittedLeafHighlight}
          className={classes.highlight}
          style={{
            top: `${y + 0.9}%`,
            left: `${x - 0.75}%`,
          }}
        />

        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          style={{ marginBottom: '40px' }}
        >
          <Box padding="1rem" paddingBottom="0.5rem" display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" align="left">
              Her kan du se ditt ønske!
              <br />
              Den vil bli hengende på samme sted for både deg og andre.
            </Typography>
            <Button color="primary" onClick={onClose}>
              Lukk
            </Button>
          </Box>
        </Popover>
      </>
    )
  );
};

LeafHighlight.propTypes = {
  show: PropTypes.bool.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

const highlightSizePx = 64;
const highlightSizePxSmDown = 46;

const useStyles = makeStyles((theme) => ({
  highlight: {
    position: 'absolute',
    height: `${highlightSizePx}px`,
    width: `${highlightSizePx}px`,
    marginLeft: `-${highlightSizePx - 36}px`,
    marginTop: `-${highlightSizePx - 36}px`,
    [theme.breakpoints.down('xs')]: {
      height: `${highlightSizePxSmDown}px`,
      width: `${highlightSizePxSmDown}px`,
      marginLeft: `-${highlightSizePxSmDown - 25}px`,
      marginTop: `-${highlightSizePxSmDown - 25}px`,
    },
    border: '4px solid white',
    borderRadius: '40px',
    zIndex: 42,
  },
  grayOverlay: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 40,
  },

  header: {
    textAlign: 'center',
    margin: '1rem 0',
    fontSize: '2.5rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem',
    },
  },
  descriptionText: {
    width: '48rem',
    maxWidth: '90%',
    margin: '1rem auto 2rem auto',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 0.5rem',
    bottom: '1%',
    width: '100%',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: '0.5rem',
  },
  directionColumn: {
    flexDirection: 'column',
  },
  bottomText: {
    backgroundColor: 'rgba(211, 233, 255, 0.6)',
    width: 'fit-content',
    margin: 'auto',
    padding: '0.5rem',
    borderRadius: '8px',
  },
  bottomContainerSmallScreen: {
    bottom: '-15%',
  },
  bottomContainerTabletScreen: {
    bottom: '-1rem',
  },
  bottomContainerTinyScreen: {
    bottom: 0,
  },
  actionButton: {
    margin: '0 0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    zIndex: 2,
    [theme.breakpoints.down('xs')]: {
      padding: '0.5rem 1rem',
      width: '14rem',
      margin: 'auto',
      marginBottom: '0.5rem',
    },
  },
  treeContainer: {
    width: 'fit-content',
    position: 'relative',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '',
      marginBottom: '1rem',
    },
  },
  errorBox: {
    maxWidth: '30rem',
  },
  loadingSpinner: {
    position: 'absolute',
    top: '40%',
    left: '47%',
    color: 'white',
    [theme.breakpoints.down('md')]: {
      left: '45%',
    },
    [theme.breakpoints.down('xs')]: {
      left: '40%',
    },
  },
  descriptionPlaceholder: {
    height: '7.5rem',
    [theme.breakpoints.down('xs')]: {
      height: '12rem',
    },
  },
}));

export default WishtreeMain;
