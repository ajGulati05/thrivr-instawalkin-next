import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { OrderStatusBadeStyleWrapper } from './style';

const OrderStatusBadge = ({ variant, title }) => {
  return (
    <OrderStatusBadeStyleWrapper
      className={cx('badge', { [variant]: variant })}
    >
      {title}
    </OrderStatusBadeStyleWrapper>
  );
};

OrderStatusBadge.propTypes = {
  title: PropTypes.string,
  variant: PropTypes.string,
};

export default OrderStatusBadge;
