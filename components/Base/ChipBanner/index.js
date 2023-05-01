import React from 'react';
import PropTypes from 'prop-types';
import StyledChipBanner from './chipBanner.style.js';

export default function CustomChipBanner({ children }) {
  return (
    <StyledChipBanner className="w-100">
      <div className="d-flex justify-content-center border p-2">{children}</div>
    </StyledChipBanner>
  );
}

CustomChipBanner.propTypes = {
  children: PropTypes.node,
};
