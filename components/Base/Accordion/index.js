import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Accordion from 'react-bootstrap/Accordion';
import StyledAccordion from './accordion.style.js';

export default function CustomAccordion({ children, className, ...props }) {
  return (
    <StyledAccordion {...props} className={cx(className)}>
      {children}
    </StyledAccordion>
  );
}

export const AccordionToggle = Accordion.Toggle;
export const AccordionCollapse = Accordion.Collapse;

CustomAccordion.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
