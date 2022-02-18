/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const Input = ({
  type = 'text',
  label = '',
  helperText = '',
  placeholder = '',
  onChange = () => {},
  multiline = false,
  disabled = false,
  error = undefined,
  ...props
}) => {
  const classes = useStyles();

  return (
    <TextField
      type={type}
      label={label}
      variant="outlined"
      placeholder={placeholder}
      onChange={onChange}
      className={classes.textfield}
      disabled={disabled}
      multiline={multiline}
      helperText={helperText}
      error={error}
      FormHelperTextProps={{
        classes: { root: classes.biggerHelperText },
      }}
      InputLabelProps={{
        classes: { shrink: classes.shrunkInputLabel },
      }}
      InputProps={{
        classes: { disabled: classes.disabledColor },
      }}
      onInput={(e) => e.target.setCustomValidity('')}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.any.isRequired,
  size: PropTypes.number,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  props: PropTypes.any,
};

const useStyles = makeStyles({
  textfield: {
    width: '100%',
  },
  shrunkInputLabel: {
    fontSize: '1.3rem',
    backgroundColor: 'white',
    paddingRight: '3px',
  },
  biggerHelperText: {
    fontSize: '0.875rem',
  },
  disabledColor: {
    color: 'rgba(0,0,0,0.55)',
  },
});

export default Input;
