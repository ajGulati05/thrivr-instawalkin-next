import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import StyledInputGroup from './inputGroup.style.js';
import CustomInput from '../Input/';

export default function CustomInputGroup({
  appendNode,
  className,
  inputProps,
  isCustom,
  children,
  ...props
}) {
  return (
    <StyledInputGroup {...props} className={cx(className)}>
      {appendNode}
      {!isCustom ? <CustomInput {...inputProps} /> : children}
    </StyledInputGroup>
  );
}

CustomInputGroup.defaultProps = {
  isCustom: false,
};

CustomInputGroup.propTypes = {
  appendNode: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  inputProps: PropTypes.object,
  isCustom: PropTypes.bool,
};
