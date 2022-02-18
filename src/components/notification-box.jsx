/* eslint-disable react/require-default-props */
import React from 'react';
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

const NotificationBox = ({
  variant, outlined = false, header, text, buttonText, buttonAction, buttonIcon, showIcon = false,
  children = undefined, className = '', margin = '0',
}) => {
  const classes = useStyles();

  const isAnyLowerContent = text || buttonText
    || (Array.isArray(children) ? children.some((c) => c) : children);

  return (
    <Paper
      elevation={outlined ? 0 : 3}
      className={clsx(classes[`${variant}Box`], className, outlined ? classes.borderBox : classes.noBorderBox)}
      style={{ margin }}
    >
      <Box
        display="flex"
        flexDirection="row"
        marginBottom={isAnyLowerContent ? '0.5rem' : '0'}
      >
        {showIcon && (
          <>
            {variant === 'error' && <ErrorIcon className={classes.errorIcon} />}
            {variant === 'info' && <InfoIcon className={classes.infoIcon} />}
            {variant === 'warning' && <WarningIcon className={classes.warningIcon} />}
            {variant === 'success' && <SuccessIcon className={classes.successIcon} />}
          </>
        )}

        <Typography variant="h3" className={classes.header}>
          {header}
        </Typography>
      </Box>

      <Typography variant="body1">
        {text}
      </Typography>

      {children}

      {buttonText && (
        <Button
          startIcon={buttonIcon}
          onClick={buttonAction}
          className={classes.mt05}
          variant="contained"
          color="primary"
          disableElevation
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
};

NotificationBox.propTypes = {
  variant: PropTypes.oneOf(['info', 'warning', 'error', 'success']).isRequired,
  outlined: PropTypes.bool,
  header: PropTypes.string.isRequired,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  buttonAction: PropTypes.func,
  buttonIcon: PropTypes.any,
  showIcon: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  margin: PropTypes.string,
};

const useStyles = makeStyles((theme) => ({
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

export default NotificationBox;
