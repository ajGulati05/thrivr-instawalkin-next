import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import StyledButton from './button.style.js';

const CustomButton = React.forwardRef(
  ({ children, className, varient, ...props }, ref) => (
    <StyledButton
      ref={ref}
      {...props}
      className={cx(className, {
        'btn-white': varient === 'secondary',
      })}
    >
      {children}
    </StyledButton>
  )
);

CustomButton.displayName = 'CustomButton';

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  varient: PropTypes.string,
};

export default CustomButton;
