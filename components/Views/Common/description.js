import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Container from 'react-bootstrap/Container';
import { DescriptionStyleWrapper } from './style';

export default function DescriptionComponent({
  children,
  className,
  ...props
}) {
  return (
    <DescriptionStyleWrapper
      {...props}
      className={cx('description', className)}
    >
      <Container>{children}</Container>
    </DescriptionStyleWrapper>
  );
}

DescriptionComponent.propTypes = {
  children: PropTypes.node.isRequired,
  faqs: PropTypes.arrayOf(),
  className: PropTypes.string,
  title: PropTypes.string,
};
