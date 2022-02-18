import React, { useState, useEffect } from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import SuccessIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
 Box, makeStyles, Typography, Paper,
} from '@material-ui/core';
import Button from '@trdk/style/Button';

const InformationBox = ({
  variant,
  outlined = false,
  header = undefined,
  text,
  buttonText,
  buttonAction,
  buttonIcon,
  buttonVariant = 'contained',
  showIcon = false,
  children,
  className = '',
  padding = '1.15rem',
  margin = '0',
  width,
  background,
  duration,
}) => {
  const classes = useStyles();
  const [isOpaque, setIsOpaque] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (duration) {
      setIsOpaque(false);
      setIsHidden(false);
      setTimeout(() => setIsOpaque(true), duration);
      setTimeout(() => setIsHidden(true), duration + 500);
    }
  }, [duration, text, header, variant]);

  const isAnyLowerContent = text
    || buttonText
    || (Array.isArray(children) ? children.some((c) => c) : children);

  const style = {};
  if (margin) {
    style.margin = margin;
  }
  if (width) {
    style.width = width;
  }
  if (background) {
    style.background = background;
  }
  if (padding) {
    style.padding = padding;
  }

  if (isHidden) {
    return null;
  }

  return (
    <Paper
      elevation={outlined ? 0 : 3}
      className={clsx(
        classes.informationBox,
        classes[`${variant}Box`],
        className,
        outlined ? classes.borderBox : classes.noBorderBox,
        isOpaque ? classes.hiddenInformationBox : '',
      )}
      style={style}
    >
      {header && (
        <Box
          display="flex"
          flexDirection="row"
          marginBottom={isAnyLowerContent ? '0.5rem' : '0'}
          alignItems="center"
        >
          {showIcon && (
            <>
              {variant === 'error' && <ErrorIcon className={classes.errorIcon} />}
              {variant === 'info' && <InfoIcon className={classes.infoIcon} />}
              {variant === 'warning' && (
                <WarningIcon className={classes.warningIcon} />
              )}
              {variant === 'success' && (
                <SuccessIcon className={classes.successIcon} />
              )}
            </>
          )}

          <Typography variant="h3" className={classes.header}>
            {header}
          </Typography>
        </Box>
      )}

      {text && (
        <Box display="flex" flexDirection="row" alignItems="center">
          {!header && showIcon && (
          <>
            {variant === 'error' && <ErrorIcon className={classes.errorIcon} />}
            {variant === 'info' && <InfoIcon className={classes.infoIcon} />}
            {variant === 'warning' && <WarningIcon className={classes.warningIcon} />}
            {variant === 'success' && <SuccessIcon className={classes.successIcon} />}
          </>
            )}

          <Typography variant="body1">
            {text}
          </Typography>
        </Box>
      )}

      {children}

      {buttonText && (
        <Button
          startIcon={buttonIcon}
          onClick={buttonAction}
          className={classes.mt05}
          variant={buttonVariant}
          color="primary"
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
};

InformationBox.propTypes = {
  variant: PropTypes.oneOf(['info', 'warning', 'error', 'success']).isRequired,
  buttonVariant: PropTypes.oneOf(['contained', 'outlined']),
  outlined: PropTypes.bool,
  header: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  buttonAction: PropTypes.func,
  buttonIcon: PropTypes.any,
  showIcon: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  margin: PropTypes.string,
  padding: PropTypes.string,
  width: PropTypes.string,
  background: PropTypes.string,
  duration: PropTypes.number,
};

const useStyles = makeStyles((theme) => ({
  informationBox: {
    transition: 'opacity 0.5s',
    opacity: 1,
  },
  hiddenInformationBox: {
    opacity: 0,
  },
  mt05: {
    marginTop: '0.5rem',
  },
  errorIcon: {
    color: theme.palette.error.main,
    marginRight: '0.5rem',
  },
  infoIcon: {
    color: theme.palette.primary.main,
    marginRight: '0.5rem',
  },
  warningIcon: {
    color: theme.palette.warning.main,
    marginRight: '0.5rem',
  },
  successIcon: {
    color: theme.palette.success.main,
    marginRight: '0.5rem',
  },
  header: {
    fontSize: '1.25rem',
    color: 'rgba(0, 0, 0, 0.87) !important',
  },
  noBorderBox: {
    border: 'none',
    padding: '1.3rem',
  },
  borderBox: {
    borderWidth: '1px',
    borderRadius: '4px',
    borderStyle: 'solid',
    padding: '1.3rem',
  },
  successBox: {
    backgroundColor: '#f7fff6',
    borderColor: theme.palette.success.main,
  },
  errorBox: {
    backgroundColor: '#fce9e9',
    borderColor: theme.palette.error.main,
  },
  infoBox: {
    backgroundColor: '#f0f7ff',
    borderColor: theme.palette.primary.main,
  },
  warningBox: {
    backgroundColor: '#fff7eb',
    borderColor: theme.palette.warning.main,
  },
}));

export default InformationBox;
