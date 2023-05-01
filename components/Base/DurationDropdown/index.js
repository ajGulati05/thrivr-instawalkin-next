import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../Button';
import OutsideClickHandler from 'react-outside-click-handler';
import StyledDropdown from './durationDropdown.style';
import isEmpty from 'lodash.isempty';

export default function CustomDurationDropdown({
  className,
  list = [],
  value,
  handleDropdownChange,
  ...props
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  return (
    <StyledDropdown {...props} className={cx(className)}>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <ul
          className={cx('custom-dd', { open: open })}
          placeholder="Select Duration"
        >
          <li className="d-none sub-title">
            <span className="ttl">Duration</span>
            <span className="close" onClick={handleClose}>
              Close
            </span>
          </li>
          {value && !isEmpty(list) ? (
            <li className="init form-control" onClick={handleOpen}>
              {list.find((element) => element.id === value).description}
            </li>
          ) : (
            <li className="init form-control placeholder" onClick={handleOpen}>
              Duration
            </li>
          )}
          {!isEmpty(list) ? (
            list.map((data, index) => (
              <li
                key={index}
                onClick={() => handleDropdownChange(data)}
                className={cx({
                  selected: value === data.id,
                  show: open,
                })}
              >
                <span className="min">{data.description}</span>
                <span className="value">${data.pricing.total_amount}</span>
              </li>
            ))
          ) : (
            <li
              className={cx({
                show: open,
              })}
            >
              <span className="min">No Data</span>
            </li>
          )}
          <li className="d-none show-btn">
            <Button className="w-100" onClick={handleClose}>
              Show results
            </Button>
          </li>
        </ul>
      </OutsideClickHandler>
      <img
        src="/images/down.svg"
        className={cx('right-img', { 'image-rotate': open })}
      />
    </StyledDropdown>
  );
}

CustomDurationDropdown.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
  handleDropdownChange: PropTypes.func,
  list: PropTypes.array,
};
