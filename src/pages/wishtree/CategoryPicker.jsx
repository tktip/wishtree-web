import clsx from 'clsx';
import { Box, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import CheckIcon from '@material-ui/icons/Check';

const CategoryPicker = ({
  allCategories, selectedCategory = null, onCategorySelected, isError,
}) => {
  const classes = useStyles();

  function onKeyPress(e, category) {
    if (e.key === 'Enter' || e.key === ' ') {
      onCategorySelected(category);
    }
  }

  return (
    <Box borderRadius="6px" style={{ border: isError ? '1px solid red' : 'none', padding: isError ? '0.5rem' : '0' }}>
      <Typography variant="body1" component="label" htmlFor="colorPicker">
        Velg farge på bladet ditt:
      </Typography>

      <Box display="flex" flexDirection="row" padding="0.5rem 0">
        {allCategories.map((category) => {
          const isSelected = selectedCategory?.id === category.id;

          return (
            <div
              id="colorPicker"
              key={category.id}
              className={clsx(classes.category, isSelected ? classes.selectedCategory : '')}
              style={{
                backgroundColor: isSelected ? `darken(${category.description}, 50%)` : category.description,
                borderColor: category.description,
              }}
              onClick={() => onCategorySelected(category)}
              role="button"
              aria-label={`Farge ${category.name}`}
              onFocus={() => {}}
              tabIndex={0}
              onKeyPress={(e) => onKeyPress(e, category)}
            >
              {isSelected && (
                <CheckIcon
                  style={{ color: '#333' }}
                  className={classes.checkIcon}
                />
              )}
            </div>
          );
        })}
      </Box>

      {isError && (
        <Typography variant="body2" color="error">
          Du må velge en farge
        </Typography>
      )}
    </Box>
  );
};

CategoryPicker.propTypes = {
  allCategories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object,
  onCategorySelected: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
};

const useStyles = makeStyles({
  category: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'saturate(80%)',
    borderRadius: '50px',
    width: '2.25rem',
    height: '2.25rem',
    marginRight: '1rem',
    transition: 'all 100ms',
    borderWidth: '0',
    borderStyle: 'solid',
    boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    '&:focus, &:hover': {
      boxShadow: '0 0 0 2px #555, 0px 3px 4px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 2px 8px 2px rgb(0 0 0 / 12%)',
      outline: 'none',
      cursor: 'pointer',
    },
  },
  selectedCategory: {
    borderWidth: '2px',
    boxShadow: '0px 3px 4px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 2px 8px 2px rgb(0 0 0 / 12%)',
  },
});

export default CategoryPicker;
