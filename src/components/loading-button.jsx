/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, Box } from '@material-ui/core';
import Button from '@trdk/style/Button';

export default function LoadingButton({
 isLoading, margin = '', isFullWidth = false, ...props
}) {
  const { disabled } = props;
  const shouldDisableButton = disabled || isLoading;
  const style = { width: isFullWidth ? '100%' : 'fit-content' };

  return (
    <Box display="inline-flex" flexDirection="column" margin={margin} style={style}>
      <Button style={style} {...props} disabled={shouldDisableButton} />
      {isLoading ? (
        <LinearProgress style={{ margin: '-2px 0px 0 0px' }} />
      ) : (
        <Box height="4px" />
      )}
    </Box>
  );
}

LoadingButton.propTypes = {
  isLoading: PropTypes.bool,
  margin: PropTypes.string,
  isFullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
};
