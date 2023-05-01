import React, { useEffect } from 'react';
import cx from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector, useDispatch } from 'react-redux';
import { handleTimekitModal, initializeTimekitWidget } from 'redux/app/actions';

export default function RequestDemoComponent() {
  const timekitModalFlag = useSelector((state) => state.app.timekitModalFlag);

  const dispatch = useDispatch();

  useEffect(() => {
    window.$ = require('jquery');
    let TimekitBooking = require('timekit-booking');
    let widgetTimekit = new TimekitBooking();
    dispatch(initializeTimekitWidget(widgetTimekit));
  }, [dispatch]);

  const handleClose = () => dispatch(handleTimekitModal(false));

  return (
    <div
      className={cx('modal fade time-kit-modal', {
        show: timekitModalFlag,
      })}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <OutsideClickHandler onOutsideClick={() => handleClose()}>
            <div className="modal-header">
              <h5 className="modal-title">
                Please pick a time slot that works for you
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => handleClose()}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div id="bookingjs"></div>
            </div>
            <div className="modal-footer">
              On receiving this, one of our representatives will contact you
              within 24 hours. We promise not to spam you.
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    </div>
  );
}
