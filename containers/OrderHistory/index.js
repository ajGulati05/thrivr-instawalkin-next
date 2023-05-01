import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import InputGroup from 'components/Base/InputGroup';
import Input from 'components/Base/Input';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import ErrorAlert from 'components/ErrorAlert';
import isEmpty from 'lodash.isempty';
import Button from 'components/Base/Button';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';
import OrderStatusBadge from 'components/Views/Common/orderStatusBadge';
import { OrderHistoryStyleWrapper } from './orderHistory.style';
import {
  getBookingData,
  getProductAndPricing,
  InitiateModifyBookingAppointment,
  cancleBookingAppointment,
  addBookingReceipt,
} from 'redux/app/actions';
import CustomModal from 'components/Base/Modal';
import Alert from 'react-bootstrap/Alert';

export default function OrderHistory() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const errorBackend = useSelector((state) => state.app.error);
  const bookingList = useSelector((state) => state.app.bookingList);
  const productPricingArr = useSelector((state) => state.app.productPricingArr);
  const userProfile = useSelector((state) => state.auth.userProfile);

  const dispatch = useDispatch();
  const [redirectFrom, setRedirectFrom] = useState('/');
  const router = useRouter();

  const [bookedData, setBookedData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [cancleMessage, setCancleMessage] = useState(null);
  const [cancleUrl, setCancleUrl] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  let [isSchedule, setIsReschedule] = useState(false);
  let [rescheduleUrl, setRescheduleUrl] = useState(null);
  let [rescheduleSlug, setRescheduleSlug] = useState(null);

  let [modalData, setModalData] = useState(null);
  let [receiptModalShow, setReceiptModalShow] = useState(false);
  let [receiptEmail, setReceiptEmail] = useState('');
  let [receiptSuccess, setReceiptSuccess] = useState(false);
  let [receiptError, setReceiptError] = useState(false);
  let [modalErrorMessage, setModalErrorMessage] = useState();
  let [cancelConfirmModalShow, setCancelConfirmModalShow] = useState(false);

  //   Mount
  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isEmpty(bookingList)) {
      let booked = [];
      let completed = [];
      bookingList.map((data) => {
        if (data.modified || data.closed) {
          completed.push(data);
        } else if (!data.hasEnded || (!data.hasEnded && !data.modified)) {
          booked.push(data);
        } else {
          completed.push(data);
        }
      });
      setBookedData(booked);
      setCompletedData(completed);
    }
  }, [bookingList]);

  // Cleaning memory
  useEffect(() => {
    if (!modalShow) {
      setModalData(null);
      setRescheduleUrl(null);
      setRescheduleSlug(null);
      setIsReschedule(false);
    }
  }, [modalShow]);

  const fetchData = async () => {
    await dispatch(getBookingData());
    await dispatch(getProductAndPricing({}, true));
  };

  const redirectDetail = (slug) => {
    router.push('/order-detail/[detail]', `/order-detail/${slug}`);
  };

  const handleEmail = (e, data) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEmpty(userProfile.email)) {
      handleReceipt(data);
    } else {
      setReceiptModalShow(true);
    }
  };

  const handleEmailChange = (e) => {
    setReceiptEmail(e.target.value);
  };

  const addEmail = async () => {
    let payload = {
      email: receiptEmail,
    };
    if (!isEmpty(userProfile) && !isEmpty(userProfile.lastname)) {
      payload.lastname = userProfile.lastname;
    }
    let { status } = await dispatch(userEmailUpdate(payload));
    if (status) {
      handleReceipt();
    }
  };

  const handleReceipt = async (data) => {
    let { status, msg, error } = await dispatch(
      addBookingReceipt({ booking_slug: data.booking_slug })
    );
    if (status) {
      if (receiptModalShow) {
        setReceiptModalShow(false);
      }
      setModalErrorMessage(msg);
      setReceiptSuccess(true);
      setTimeout(() => {
        setReceiptSuccess(false);
        setModalErrorMessage('');
      }, 3000);
    }
    if (!isEmpty(error)) {
      setModalErrorMessage(error);
      setReceiptError(true);
      setTimeout(() => {
        setReceiptError(false);
        setModalErrorMessage('');
      }, 3000);
    }
  };

  /* Action Buttons */
  const showBtn = (data) => {
    if (data.modified) {
      return (
        <Button className="btn btn-white" onClick={(e) => handleEmail(e, data)}>
          Email receipt
        </Button>
      );
    } else if (!data.hasEnded) {
      return (
        <>
          <a
            className="cancel-order"
            onClick={(e) => handleCancel(e, data)}
            data-value="C"
          >
            Cancel
          </a>
          <Button
            className="reschedule"
            onClick={(e) => handleReschedule(e, data)}
            data-value="R"
          >
            Reschedule
          </Button>
        </>
      );
    } else if (data.hasEnded && !data.closed) {
      return (
        <>
          <Button
            className="btn btn-white"
            onClick={(e) => handleEmail(e, data)}
          >
            Email receipt
          </Button>

          {/* <Button
            className="btn review-btn"
            onClick={() => setReviewModalShow(true)}
          >
            Leave a review
          </Button> */}
        </>
      );
    } else if (data.hasEnded && data.closed) {
      return (
        <>
          <Button
            className="btn btn-white"
            onClick={(e) => handleEmail(e, data)}
          >
            Email receipt
          </Button>
        </>
      );
    }
  };

  const handleCancel = async (e, detail) => {
    e.preventDefault();
    e.stopPropagation();
    if (!detail.hasEnded) {
      let payload = {
        app_source: 'web',
        modifier: e.currentTarget.dataset.value,
      };
      let slug = {
        slug: detail.booking_slug,
        payload,
      };
      let { status, data } = await dispatch(
        InitiateModifyBookingAppointment(slug)
      );
      if (status) {
        setCancleMessage(data.message);
        setCancleUrl(data['callback-url']);
        setModalShow(true);
      }
    }
  };

  const handleReschedule = async (e, detail) => {
    // e.preventDefault();
    e.stopPropagation();
    let payload = {
      app_source: 'web',
      modifier: e.currentTarget.dataset.value,
    };
    let slug = {
      slug: detail.booking_slug,
      payload,
    };
    let { status, data } = await dispatch(
      InitiateModifyBookingAppointment(slug)
    );
    if (status) {
      setCancleMessage(data.message);
      setRescheduleUrl(data['callback-url']);
      setRescheduleSlug(data['therapist_slug']);
      setIsReschedule(true);
      setModalData(detail);
      setModalShow(true);
    }
  };

  const handleRedirect = async () => {
    router.push(
      `/massage-therapists/Saskatoon/${
        modalData.therapist_slug
      }?rescheduleslug=${window.btoa(
        rescheduleSlug
      )}&rescheduleurl=${rescheduleUrl}`
    );
  };

  const cancleBooking = async () => {
    let url = cancleUrl.split('booking/')[1];
    let payload = {
      url,
    };
    let { status } = await dispatch(cancleBookingAppointment(payload));
    if (status) {
      setModalShow(false);
      fetchData();
      setCancelConfirmModalShow(true);
    }
  };

  const getTotalAmount = (data) => {
    if (!isEmpty(data)) {
      let totalDiscount = 0,
        totalTax = 0;

      if (data.discount) {
        totalDiscount = parseFloat(data.discount);
      }

      if (data.tax_amount) {
        totalTax = parseFloat(data.tax_amount);
      }

      return `${(
        parseFloat(data.massage_price) -
        totalDiscount +
        totalTax
      ).toFixed(2)}`;
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Order History - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="header-white" />

        {/* Banner Section */}
        <OrderHistoryStyleWrapper>
          <Container>
            {/* Error Alert */}
            {errorBackend && typeof errorBackend === 'string' && (
              <ErrorAlert message={errorBackend} />
            )}

            {/* Email Receipt Alert */}
            <AnimatePresence>
              {receiptSuccess && (
                <motion.div
                  className="alert-wrapper position-fixed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant={'success'}>{modalErrorMessage}</Alert>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Email Receipt Error Alert */}
            <AnimatePresence>
              {receiptError && (
                <motion.div
                  className="alert-wrapper position-fixed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant={'error'}>{modalErrorMessage}</Alert>
                </motion.div>
              )}
            </AnimatePresence>
            {!isEmpty(bookedData) ? (
              <div className="upcoming-order-wrapper order-wrapper">
                <h4 className="sub-title order-title">Upcoming</h4>
                <table className="upcoming-order table">
                  <thead>
                    <tr>
                      <th className="massage-specialist">Massage Therapists</th>
                      <th className="date-time">Date and time</th>
                      <th className="duration">Duration</th>
                      <th className="type">Type</th>
                      <th className="cost">Price</th>
                      <th className="status">Status</th>
                      <th className="action">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedData.map((data, index) => (
                      <tr
                        key={index}
                        className="orderdata"
                        onClick={() => redirectDetail(data.booking_slug)}
                      >
                        <td className="massage-specialist">
                          <span className="img">
                            <img
                              src={`${
                                !isEmpty(data.therapist_photo)
                                  ? data.therapist_photo
                                  : '/images/avatar.png'
                              }`}
                            />
                          </span>
                          <h5 className="specialist-name">
                            {!isEmpty(data.therapist_name)
                              ? data.therapist_name
                              : '-'}
                          </h5>
                        </td>
                        <td className="date-time">
                          {!isEmpty(data.massage_start)
                            ? data.massage_start
                            : '-'}
                        </td>
                        <td className="duration">
                          {productPricingArr.map((element) => {
                            if (data.project_id == element.id) {
                              return element.mobile_name;
                            }
                          })}
                        </td>
                        <td className="type">
                          <img
                            src={`${
                              data.speciality.image_path
                                ? data.speciality.image_path
                                : '/images/deep.svg'
                            }`}
                          />
                        </td>
                        <td className="cost">
                          CAD $
                          {!isEmpty(data) &&
                          !isEmpty(data.pricing) &&
                          !isEmpty(data.pricing.massage_price)
                            ? getTotalAmount(data.pricing)
                            : '00.00'}
                        </td>
                        <td className="status">
                          <OrderStatusBadge
                            title={data.status}
                            variant="blue"
                          />
                        </td>
                        <td className="action">
                          <span className="d-none d-md-block">
                            {showBtn(data)}
                          </span>
                          <a
                            className="view-link d-block d-md-none"
                            onClick={() => redirectDetail(data.booking_slug)}
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ''
            )}
            {!isEmpty(completedData) ? (
              <div className="previous-order-wrapper order-wrapper">
                <h4 className="sub-title order-title">Previous orders</h4>
                <table className="upcoming-order table">
                  <thead>
                    <tr>
                      <th className="massage-specialist">Massage Therapists</th>
                      <th className="date-time">Date and time</th>
                      <th className="duration">Duration</th>
                      <th className="type">Type</th>
                      <th className="cost">Cost</th>
                      <th className="status">Status</th>
                      <th className="action">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedData.map((data, index) => (
                      <tr
                        key={index}
                        className="orderdata"
                        onClick={() => redirectDetail(data.booking_slug)}
                      >
                        <td className="massage-specialist">
                          <span className="img">
                            <img
                              src={`${
                                !isEmpty(data.therapist_photo)
                                  ? data.therapist_photo
                                  : '/images/avatar.png'
                              }`}
                            />
                          </span>
                          <h5 className="specialist-name">
                            {!isEmpty(data.therapist_name)
                              ? data.therapist_name
                              : '-'}
                          </h5>
                        </td>
                        <td className="date-time">
                          {!isEmpty(data.massage_start)
                            ? data.massage_start
                            : '-'}
                        </td>
                        <td className="duration">
                          {productPricingArr.map((element) => {
                            if (data.project_id == element.id) {
                              return element.mobile_name;
                            }
                          })}
                        </td>
                        <td className="type">
                          <img
                            src={`${
                              data.speciality.image_path
                                ? data.speciality.image_path
                                : '/images/deep.svg'
                            }`}
                          />
                        </td>
                        <td className="cost">
                          CAD $
                          {data?.pricing?.massage_price
                            ? (
                                Number(data?.pricing?.massage_price) -
                                Number(data?.pricing?.discount) +
                                Number(data?.pricing?.tax_amount)
                              ).toFixed(2)
                            : '00.00'}
                        </td>
                        <td className="status">
                          {data.status !== 'Booked' ? (
                            <OrderStatusBadge
                              title={data.status}
                              variant="grey"
                            />
                          ) : (
                            <OrderStatusBadge
                              title={data.status}
                              variant="blue"
                            />
                          )}
                        </td>
                        <td className="action">
                          <span className="d-none d-md-block">
                            {showBtn(data)}
                            {/* <Button className="rebook">Rebook</Button> */}
                          </span>
                          <a
                            className="view-link d-block d-md-none"
                            onClick={() => redirectDetail(data.booking_slug)}
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ''
            )}
            {loaderCount === 0 &&
              isEmpty(completedData) &&
              isEmpty(bookedData) && (
                <h4 className="no-order-text">
                  You have no bookings yet. Make a{' '}
                  <Link href="/">
                    <a>booking here</a>
                  </Link>{' '}
                </h4>
              )}
            <CustomModal
              show={modalShow}
              // onHide={() => setModalShow(false)}
              size="lg"
              container={() => document.querySelector('.content-wrapper')}
              className="modal-cancle desktop-alt"
              header={
                <>
                  <h5
                    className="modal-title d-none d-sm-block"
                    id="exampleModalLabel"
                  >
                    {isSchedule ? 'Reschedule order' : 'Cancel order'}
                  </h5>
                  <h5
                    className="modal-title d-block d-sm-none"
                    id="exampleModalLabel"
                  >
                    {isSchedule ? 'Reschedule your order' : 'Cancel your order'}
                  </h5>
                </>
              }
              body={<div className="confirm-content">{cancleMessage}</div>}
              footer={
                <>
                  <Button
                    className="btn btn-white d-none d-sm-block"
                    onClick={() => setModalShow(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn mobile-btn d-sm-none d-sm-block"
                    onClick={isSchedule ? handleRedirect : cancleBooking}
                  >
                    Confirm
                  </Button>
                </>
              }
            />

            <CustomModal
              show={receiptModalShow}
              onHide={() => setReceiptModalShow(false)}
              size="lg"
              container={() => document.querySelector('.content-wrapper')}
              className="modal-cancle desktop-alt"
              header={
                <h5 className="modal-title" id="exampleModalLabel">
                  Enter an email you're likely to receive your receipt to..
                </h5>
              }
              body={
                <InputGroup isCustom>
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleEmailChange}
                  />
                </InputGroup>
              }
              footer={
                <>
                  <Button
                    className={`${
                      receiptEmail ? '' : 'disabled'
                    } ${'btn mobile-btn'}`}
                    onClick={addEmail}
                  >
                    Save
                  </Button>
                </>
              }
            />
          </Container>

          <CustomModal
            show={cancelConfirmModalShow}
            onHide={() => setCancelConfirmModalShow(false)}
            size="lg"
            container={() => document.querySelector('.content-wrapper')}
            className="modal-cancle desktop-alt"
            header={
              <h5 className="modal-title" id="exampleModalLabel">
                Your massage has been cancelled
              </h5>
            }
            footer={
              <Button
                className="btn btn-white d-none d-sm-block"
                onClick={() => setCancelConfirmModalShow(false)}
              >
                Ok
              </Button>
            }
          />
        </OrderHistoryStyleWrapper>

        {/* Footer Section */}
        <Footer />
      </div>
    </PageLoader>
  );
}
