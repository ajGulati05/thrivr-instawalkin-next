import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import StyledInput from './input.style.js';

export default function CustomInput({
  children,
  className,
  refProps,
  ...props
}) {
  return (
    <StyledInput {...props} className={cx(className)} ref={refProps}>
      {children}
    </StyledInput>
  );
}

CustomInput.propTypes = {
  children: PropTypes.node,
  refProps: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  className: PropTypes.string,
};
