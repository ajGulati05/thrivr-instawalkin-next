import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../Button';
import OutsideClickHandler from 'react-outside-click-handler';
import isEmpty from 'lodash.isempty';

export default function CustomDropdown({
  className,
  list = [],
  placeholder = 'Sort By',
  listClassname = '',
  placeholderClassname = '',
  value,
  type,
  handleDropdownChange,
  ...props
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const handleParentDropdownChange = (data) => {
    handleDropdownChange(data);
    if (type === 'payment') {
      handleClose();
    }
  };

  return (
    <>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <ul
          className={cx('dropdown-sec', className, { open: open })}
          placeholder={placeholder}
          {...props}
        >
          <li className="d-none sub-title">
            <span className="ttl">{placeholder}</span>
            <span className="close" onClick={handleClose}>
              Close
            </span>
          </li>
          {value ? (
            <li
              className={cx('init form-control', {
                [placeholderClassname]: placeholderClassname,
              })}
              onClick={handleOpen}
            >
              {list.length > 0 &&
                list.find((element) => element.id === value).value}
            </li>
          ) : (
            <li
              className={cx('init form-control placeholder', {
                [placeholderClassname]: placeholderClassname,
              })}
              onClick={handleOpen}
            >
              {placeholder}
            </li>
          )}
          {/* {!isEmpty(list) && type == 'payment' ? (
            <li
              className={cx({
                show: open,
              })}
            >
              <span className="card-disabled">Card</span>
            </li>
          ) : (
            ''
          )} */}
          {!isEmpty(list) ? (
            list.map((data, index) => (
              <li
                key={index}
                onClick={() => handleParentDropdownChange(data)}
                className={cx({
                  selected: value === data.id,
                  show: open,
                })}
              >
                <span
                  className={cx({
                    'sort-opt': !listClassname,
                    [listClassname]: listClassname,
                  })}
                  style={{ width: '125px', display: 'inline-block' }}
                >
                  {data.value}
                </span>
                {data.pricing && !isEmpty(data.pricing) && (
                  <span className="value" style={{ opacity: 0.4 }}>
                    ${data.pricing.total_amount}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li
              className={cx({
                show: open,
              })}
            >
              <span
                className={cx({
                  'sort-opt': !listClassname,
                  [listClassname]: listClassname,
                })}
              >
                No Data
              </span>
            </li>
          )}
          <li className="d-none show-btn">
            <Button className="w-100" onClick={handleClose}>
              Show results
            </Button>
          </li>
        </ul>
      </OutsideClickHandler>
      <img src="/images/down.svg" className={cx('down-img')} />
    </>
  );
}

CustomDropdown.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  listClassname: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderClassname: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleDropdownChange: PropTypes.func,
  list: PropTypes.array,
};
