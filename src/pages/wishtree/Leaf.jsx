import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

export default function Leaf({
  x, y, color = '#fff', rotateDeg, isTaken, onClick, leafSizePx, isHighlighted, takenSizeMultiplier,
}) {
  const classes = useStyles();
  let svgStyle;

  // eslint-disable-next-line no-nested-ternary
  const zIndex = isHighlighted ? 43 : (isTaken ? '2' : '1');

  let modifiedLeafSizepx = leafSizePx;
  if (isTaken) {
    modifiedLeafSizepx = leafSizePx * takenSizeMultiplier;
    svgStyle = {
      fill: color,
    };
  } else {
    svgStyle = {
      fill: 'rgba(255,255,255,0.6)',
      stroke: 'rgba(55,55,55,0.8)',
      strokeWidth: '3px',
    };
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={classes.leaf}
      viewBox="0 0 118 123"
      style={{
        top: y,
        left: x,
        transform: `rotate(${rotateDeg}deg)`,
        width: `${modifiedLeafSizepx}px`,
        height: `${modifiedLeafSizepx}px`,
        zIndex,
        transition: 'all 0.3s ease',
      }}
    >
      <path
        className={classes.leafPath}
        style={svgStyle}
        d="M 104.44,97.96 C 109.47,104.68 113.82,110.27 116.17,116.69 118.46,122.96 119.39,125.81 114.19,119.33 109.34,113.28 104.82,107.40 98.20,101.83 97.73,101.94 97.24,102.04 96.71,102.15 36.83,114.04 -6.78,87.09 0.87,0.00 47.00,15.98 112.32,9.49 105.55,91.34 105.31,94.38 105.08,96.46 104.44,97.96             104.44,97.96 104.44,97.96 104.44,97.96 Z M 88.37,84.86  C 73.32,52.43 34.66,41.31 15.48,19.13 36.30,59.76 47.66,57.97 88.37,84.86 88.37,84.86 88.37,84.86 88.37,84.86 88.37,84.86 88.37,84.86 88.37,84.86 Z"
      />
    </svg>
  );
}

Leaf.propTypes = {
  x: PropTypes.string.isRequired,
  y: PropTypes.string.isRequired,
  color: PropTypes.string,
  rotateDeg: PropTypes.number.isRequired,
  isTaken: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  leafSizePx: PropTypes.number.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  takenSizeMultiplier: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  leaf: {
    position: 'absolute',
    color: 'blue',
    '&:hover': {
      cursor: 'pointer',
    },
  },
});
