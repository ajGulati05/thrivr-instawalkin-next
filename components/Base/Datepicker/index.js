import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import cx from 'classnames';
import { useWindowWidth } from '@react-hook/window-size';
import StyledDatepicker from './datepicker.style';
import Button from '../Button';
const DatepickerInput = React.forwardRef(({ ...props }, ref) => (
  <input type="text" {...props} ref={ref} readOnly />
));

DatepickerInput.displayName = 'DatepickerInput';
export default function CustomDatepicker({
  value,
  className,
  isInvalid,
  pastDateDisable = false,
  handleDateChange,
  dateClassName,
  page,
  ...props
}) {
  const [mounted, setMounted] = useState(false);
  let datepickerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (date) => {
    handleDateChange(date);
  };

  let widthWindow = useWindowWidth();

  const onCloseDatepicker = () => {
    datepickerRef.setOpen(false);
  };

  const CalenderContainerMobile = ({ className, children }) => {
    let data = () => (
      // createPortal
      <div className={className}>
        <div
          className={cx('modal fade', {
            show: true,
          })}
          tabIndex="-1"
          role="dialog"
          aria-hidden="false"
          style={{ display: 'block', opacity: 1 }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Date</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={onCloseDatepicker}
                >
                  <span aria-hidden="true">Close</span>
                </button>
              </div>
              <div className="modal-body">{children}</div>
              <div className="modal-footer">
                <Button
                  type="button"
                  className="w-100"
                  variant="primary"
                  onClick={onCloseDatepicker}
                >
                  Show results
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      //   document.querySelector('#portal-modal')
    );
    return data();
  };

  CalenderContainerMobile.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  };

  return (
    <StyledDatepicker
      {...props}
      className={cx(className, { 'is-invalid-datepicker': isInvalid })}
    >
      {mounted && widthWindow <= 575 ? (
        <>
          <DatePicker
            placeholderText="Date"
            ref={(r) => (datepickerRef = r)}
            selected={value}
            onChange={handleChange}
            className={cx(dateClassName)}
            customInput={<DatepickerInput />}
            minDate={pastDateDisable ? new Date() : null}
            calendarClassName="datepicker-dropdown mobile-date"
            withPortal
            calendarContainer={CalenderContainerMobile}
            showMonthDropdown={page === 'intake' ? true : false}
            showYearDropdown={page === 'intake' ? true : false}
            dropdownMode="select"
            dateFormat={
              page === 'therapist-profile' ? 'd MMM, yyyy' : 'MMMM d, yyyy'
            }
          />
        </>
      ) : (
        <DatePicker
          placeholderText="Date"
          selected={value}
          disabledKeyboardNavigation
          onChange={handleChange}
          className={cx(dateClassName)}
          minDate={pastDateDisable ? new Date() : null}
          calendarClassName="datepicker-dropdown"
          popperPlacement="bottom"
          dateFormat="d MMM, yyyy"
          showMonthDropdown={page === 'intake' ? true : false}
          showYearDropdown={page === 'intake' ? true : false}
          dropdownMode="select"
          popperModifiers={{
            flip: {
              enabled: false,
            },
            preventOverflow: {
              enabled: true,
              escapeWithReference: false,
            },
          }}
        />
      )}
    </StyledDatepicker>
  );
}

CustomDatepicker.propTypes = {
  className: PropTypes.string,
  isInvalid: PropTypes.bool,
  page: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  handleDateChange: PropTypes.func,
  pastDateDisable: PropTypes.bool,
  dateClassName: PropTypes.string,
};
