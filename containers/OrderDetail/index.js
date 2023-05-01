import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import CustomModal from 'components/Base/Modal';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import OrderStatusBadge from 'components/Views/Common/orderStatusBadge';
import Footer from 'components/Footer';
import Header from 'components/Header';
import {
  OrderStyleWrapper,
  ModalStyleWrapper,
} from 'containers/Order/order.style';
import {
  getAllEndorsements,
  addTherapistReview,
  addBookingTip,
  getBookingDetail,
  getProductAndPricing,
  InitiateModifyBookingAppointment,
  cancleBookingAppointment,
  addBookingReceipt,
} from 'redux/app/actions';
import { getUserProfileData, userEmailUpdate } from 'redux/auth/actions';
import CustomDropdown from 'components/Base/Dropdown';
import Slider from 'react-slick';
import Alert from 'react-bootstrap/Alert';

const settings = {
  dots: false,
  infinite: true,
  autoplay: false,
  arrows: false,
  slidesToShow: 6,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        infinite: false,
        centerMode: true,
        centerPadding: '70px',
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        infinite: false,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
        centerPadding: '45px',
      },
    },
    {
      breakpoint: 400,
      settings: {
        infinite: false,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 360,
      settings: {
        infinite: false,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
        centerPadding: '15px',
      },
    },
  ],
};

export default function PlaceOrder() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const therapistIndividual = useSelector(
    (state) => state.app.therapistIndividual
  );
  const specialistArr = useSelector((state) => state.app.specialistArr);
  const errorBackend = useSelector((state) => state.auth.error);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const bookingList = useSelector((state) => state.app.bookingList);
  const bookingOrderDetail = useSelector((state) => state.app.bookingDetail);
  const productPricingArr = useSelector((state) => state.app.productPricingArr);
  const dispatch = useDispatch();
  const [redirectFrom, setRedirectFrom] = useState('/');
  const router = useRouter();

  let [projectIdSpecific, setProjectIdSpecific] = useState(0);
  let [projectPricing, setProjectPricing] = useState([]);
  let [specialistValue, setSpecialistArr] = useState([]);
  let [modalShow, setModalShow] = useState(false);
  let [tipmodalShow, setTipModalShow] = useState(false);
  let [reviewModalShow, setReviewModalShow] = useState(false);
  let [addInput, setAddInput] = useState(false);
  let [tipAmount, setTipAmount] = useState();
  let [activeTip, setActiveTip] = useState();
  let [reviewRating, setReviewRating] = useState(0);
  let [allEndorsements, setEndorsements] = useState([]);
  let [endorsementKey, setEndorsementKey] = useState([]);
  let [commentData, setCommentData] = useState();
  let [commentError, setCommentError] = useState(false);
  let [feedbackData, setFeedbackData] = useState();
  let [orderData, setOrderData] = useState({});
  let [isModalSuccessError, setModalSuccessError] = useState(false);
  let [modalErrorMessage, setModalErrorMessage] = useState();
  let [bookingDetail, setBookingDetail] = useState({});
  let [typeIdSpecific, setTypeIdSpecific] = useState(0);
  let [cancleMessage, setCancleMessage] = useState(null);
  let [cancleUrl, setCancleUrl] = useState(null);
  let [rescheduleUrl, setRescheduleUrl] = useState(null);
  let [rescheduleSlug, setRescheduleSlug] = useState(null);
  let [receiptModalShow, setReceiptModalShow] = useState(false);
  let [receiptEmail, setReceiptEmail] = useState('');
  let [receiptSuccess, setReceiptSuccess] = useState(false);
  let [receiptError, setReceiptError] = useState(false);
  let [isSchedule, setIsReschedule] = useState(false);
  let [cancelConfirmModalShow, setCancelConfirmModalShow] = useState(false);

  //   Mount
  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
      if (!isEmpty(router.query.detail)) {
        fetchData(router.query.detail);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    let arr = {};
    if (!isEmpty(bookingOrderDetail) && !isEmpty(bookingDetail)) {
      setBookingDetail(bookingOrderDetail);
      arr.id = bookingOrderDetail.speciality.code;
      arr.value = bookingOrderDetail.speciality.description;
      setSpecialistArr([arr]);
      setTypeIdSpecific(bookingDetail.speciality.code);
    }
  }, [bookingOrderDetail]);

  useEffect(() => {
    let duration = [];
    if (!isEmpty(productPricingArr) && !isEmpty(bookingDetail)) {
      productPricingArr.map((element) => {
        if (bookingDetail.project_id == element.id) {
          duration.id = element.id;
          duration.value = element.mobile_name;
        }
      });
      setProjectPricing([duration]);
      setProjectIdSpecific(Number(bookingDetail.project_id));
    }
  }, [productPricingArr]);

  const fetchUserData = async () => {
    let { status } = await dispatch(getUserProfileData(true));
    //await dispatch(getBookingData());
  };

  const fetchData = async (slug) => {
    let { data } = await dispatch(getBookingDetail({ slug: slug }));
    if (!isEmpty(data)) {
      let arr = {};
      arr.id = data.speciality.code;
      arr.value = data.speciality.description;
      setSpecialistArr([arr]);
      setTypeIdSpecific(data.speciality.code);
      setBookingDetail(data);
    }

    // All Endorsements
    let { data: endorsements, status } = await dispatch(getAllEndorsements());

    if (!isEmpty(endorsements)) {
      setEndorsements(endorsements);
    }

    let response = await dispatch(getProductAndPricing({}));
    if (response.status) {
      let duration = {};
      if (!isEmpty(bookingDetail)) {
        response.data.map((element) => {
          if (bookingDetail.project_id == element.id) {
            duration.id = element.id;
            duration.value = element.mobile_name;
          }
        });
        setProjectPricing([duration]);
        setProjectIdSpecific(Number(bookingDetail.project_id));
      }
    }
  };

  const handleEdit = () => {
    setAddInput(true);
  };

  const handleAmount = (e) => {
    let value = parseInt(e.target.innerText.replace('%', ''));
    let tip =
      (`${
        parseFloat(bookingDetail.pricing.massage_price) +
        parseFloat(bookingDetail.pricing.tax_amount)
      }` /
        100) *
      value;
    setTipAmount(parseInt(tip));
    setActiveTip(e.target.innerText);
    setAddInput(false);
  };

  const handleInputChange = (e) => {
    setTipAmount(parseInt(e.target.value));
    setActiveTip(e.target.value);
  };

  const setRating = (rating) => {
    if (rating === reviewRating) {
      setReviewRating(rating - 1);
    } else {
      setReviewRating(rating);
    }
  };
  const ratingData = () => {
    let star = [];
    let rat_class = '';
    for (let i = 0; i < 5; i++) {
      if (reviewRating >= i && reviewRating != null) {
        rat_class = 'active';
      } else {
        rat_class = '';
      }
      star.push(
        <li className={rat_class} key={i}>
          <a onClick={() => setRating(i)}>
            <img src="/images/star.svg" />
          </a>
        </li>
      );
    }
    return star;
  };
  const setEndorsement = (key) => {
    if (endorsementKey.includes(key)) {
      let filterKey = [...endorsementKey];
      const index = filterKey.indexOf(key);
      if (index > -1) {
        filterKey.splice(index, 1);
      }
      setEndorsementKey(filterKey);
    } else {
      if (endorsementKey.length < 3) {
        setEndorsementKey([...endorsementKey, key]);
      }
    }
  };
  const endorsementData = () => {
    let endorsement = [];
    let endorsement_class = '';
    allEndorsements.map((data, index) => {
      if (endorsementKey.includes(data?.id)) {
        endorsement_class = 'active';
      } else {
        endorsement_class = '';
      }
      endorsement.push(
        <div
          className={`${'choose-badge'} ${endorsement_class}`}
          onClick={() => setEndorsement(data?.id)}
          key={index}
        >
          <div className="img">
            <img src={`${data.path ? data.path : '/images/avatar.png'}`} />
          </div>
          <div className="name">{data.name}</div>
        </div>
      );
    });
    return endorsement;
  };
  const handleReview = async () => {
    if (isEmpty(commentData)) {
      setCommentError(true);
    }
    let data = {
      comment: commentData,
      score: reviewRating + 1,
      endorsementKey,
    };
    if (!isEmpty(feedbackData)) {
      data.feedback = feedbackData;
    }
    let payload = {
      slug: router.query.detail,
      type: 'booking',
      data,
    };
    if (!isEmpty(commentData)) {
      if (feedbackData && feedbackData.length < 10) {
        setModalErrorMessage(
          'The personal feedback must be between 10 and 500 characters.'
        );
        setModalSuccessError(true);
        setTimeout(() => {
          setModalSuccessError(false);
          setModalErrorMessage();
        }, 2100);
      } else {
        let { status, error } = await dispatch(addTherapistReview(payload));
        if (status) {
          setReviewModalShow(false);
        }
        if (!isEmpty(error)) {
          setModalErrorMessage(error);
          setModalSuccessError(true);
          setTimeout(() => {
            setModalSuccessError(false);
          }, 2100);
        }
      }
    }
  };
  const handleCommentChange = (e) => {
    setCommentData(e.target.value);
  };
  const handleFeedbackChange = (e) => {
    setFeedbackData(e.target.value);
  };
  const handleTip = async () => {
    if (tipAmount) {
      let { status, error } = await dispatch(
        addBookingTip({
          tip_amount: tipAmount,
          booking_slug: bookingDetail.booking_slug,
        })
      );
      if (status) {
        setTipModalShow(false);
      }
      if (!isEmpty(error)) {
        setModalErrorMessage(error);
        setModalSuccessError(true);
        setTimeout(() => {
          setModalSuccessError(false);
          setModalErrorMessage();
        }, 2100);
      }
    }
  };
  const handleConfirm = () => {
    router.push(
      '/order-detail/[detail]',
      `/order-detail/${bookingDetail.booking_slug}`
    );
  };
  const getTotalAmount = () => {
    if (
      !isEmpty(bookingDetail) &&
      !isEmpty(bookingDetail.pricing) &&
      !isEmpty(bookingDetail.pricing.massage_price)
    ) {
      let totalDiscount = 0,
        totalTax = 0;

      if (
        !isEmpty(bookingDetail) &&
        !isEmpty(bookingDetail.pricing) &&
        bookingDetail.pricing.discount
      ) {
        totalDiscount = parseFloat(bookingDetail?.pricing?.discount);
      }

      if (bookingDetail?.pricing?.tax_amount) {
        totalTax = parseFloat(bookingDetail?.pricing?.tax_amount);
      }

      return `${(
        parseFloat(bookingDetail?.pricing?.massage_price) -
        totalDiscount +
        totalTax
      ).toFixed(2)}`;
    }
    return 0.0;
  };

  /* Action Buttons */
  const showActionBtns = () => {
    if (bookingDetail.modified) {
      return (
        <>
          <Button className="btn btn-white" onClick={handleEmail}>
            Email receipt
          </Button>

          <Button
            className="btn review-btn"
            onClick={() => setReviewModalShow(true)}
          >
            Leave a review
          </Button>
        </>
      );
    } else if (!bookingDetail.hasEnded) {
      return (
        <>
          <Button className="btn btn-white" onClick={handleCancel} value="C">
            Cancel
          </Button>
          <Button className="btn" onClick={handleReschedule} value="R">
            Reschedule
          </Button>
        </>
      );
    } else if (bookingDetail.hasEnded && bookingDetail.closed) {
      return (
        <>
          <Button className="btn btn-white" onClick={handleEmail}>
            Email receipt
          </Button>

          <Button
            className="btn review-btn"
            onClick={() => setReviewModalShow(true)}
          >
            Leave a review
          </Button>
        </>
      );
    } else if (bookingDetail.hasEnded && !bookingDetail.closed) {
      return (
        <>
          <Button
            className="btn btn-white"
            onClick={() => setTipModalShow(true)}
          >
            Add tip
          </Button>

          <Button className="btn btn-white" onClick={handleEmail}>
            Email receipt
          </Button>

          <Button
            className="btn review-btn"
            onClick={() => setReviewModalShow(true)}
          >
            Leave a review
          </Button>
        </>
      );
    } else {
      return (
        <>
          {!isEmpty(bookingDetail) && bookingDetail.status == 'Booked' && (
            <Button
              className="btn btn-white"
              onClick={() => setTipModalShow(true)}
            >
              Add tip
            </Button>
          )}
          <Button
            className="btn review-btn"
            onClick={() => setReviewModalShow(true)}
          >
            Leave a review
          </Button>
        </>
      );
    }
  };

  const handleCancel = async () => {
    let payload = {
      app_source: 'web',
      modifier: event.target.value,
    };
    let slug = {
      slug: bookingDetail.booking_slug,
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
  };

  const handleReschedule = async () => {
    let payload = {
      app_source: 'web',
      modifier: event.target.value,
    };
    let slug = {
      slug: bookingDetail.booking_slug,
      payload,
    };
    let { status, data } = await dispatch(
      InitiateModifyBookingAppointment(slug)
    );
    if (status) {
      setCancleMessage(data.message);
      setRescheduleUrl(data['callback-url']);
      setRescheduleSlug(data['therapist_slug']);
      setModalShow(true);
      setIsReschedule(true);
    }
  };

  const cancleBooking = async () => {
    let url = cancleUrl.split('booking/')[1];
    let payload = {
      url,
    };
    let { status } = await dispatch(cancleBookingAppointment(payload));
    if (status) {
      setModalShow(false);
      setCancelConfirmModalShow(true);
      fetchData(router.query.detail);
    }
  };

  const handleRedirect = async () => {
    router.push(
      `/massage-therapists/Saskatoon/${
        bookingDetail.therapist_slug
      }?rescheduleslug=${window.btoa(
        rescheduleSlug
      )}&rescheduleurl=${rescheduleUrl}`
    );
  };

  const handleEmail = () => {
    if (!isEmpty(userProfile.email)) {
      handleReceipt();
    } else {
      setReceiptModalShow(true);
    }
  };

  const handleReceipt = async () => {
    let { status, msg, error } = await dispatch(
      addBookingReceipt({ booking_slug: bookingDetail.booking_slug })
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
      }, 2100);
    }
    if (!isEmpty(error)) {
      setModalErrorMessage(error);
      setReceiptError(true);
      setTimeout(() => {
        setReceiptError(false);
        setModalErrorMessage('');
      }, 2100);
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

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Order Detail - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="header-white" />

        {/* Banner Section */}
        <OrderStyleWrapper>
          <ModalStyleWrapper>
            <Container>
              <div className="order-confirm-wrapper order-detail-wrapper">
                <AnimatePresence>
                  {receiptSuccess && (
                    <motion.div
                      className="alert-wrapper"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0 }}
                    >
                      <Alert variant={'success'}>{modalErrorMessage}</Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {receiptError && (
                    <motion.div
                      className="alert-wrapper"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0 }}
                    >
                      <Alert variant={'error'}>{modalErrorMessage}</Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                <a
                  onClick={() => router.push('/order-history')}
                  className="back-arrow"
                >
                  <img src="/images/left.svg" />
                </a>
                <div className="order-header">
                  <div className="massage-date-time">
                    <h4 className="sub-title order-title">Your massage</h4>
                    <h3 className="order-sub-title">
                      {!isEmpty(bookingDetail.massage_start)
                        ? bookingDetail.massage_start.split(', ')[0]
                        : '-'}
                    </h3>
                    <h3 className="order-sub-title">
                      {!isEmpty(bookingDetail.massage_start)
                        ? bookingDetail.massage_start.split(', ')[1]
                        : '-'}
                    </h3>
                  </div>
                  <OrderStatusBadge
                    title={bookingDetail.status}
                    variant={`${
                      bookingDetail.status == 'Booked' ? 'blue' : 'green'
                    }`}
                  />
                </div>
                <div className="massage-type">
                  <h4 className="sub-title order-title">Type</h4>
                  <div className="minutes-dropdown">
                    <InputGroup
                      isCustom
                      className="input-group input-group-disabled"
                    >
                      <CustomDropdown
                        list={specialistValue}
                        value={typeIdSpecific}
                        listClassname="hours"
                        placeholderClassname="profile-title"
                        placeholder="Min"
                      />
                    </InputGroup>
                  </div>
                </div>
                <div className="massage-duration">
                  <h4 className="sub-title order-title">Duration</h4>
                  <div className="minutes-dropdown">
                    <InputGroup isCustom className="input-group">
                      <CustomDropdown
                        list={projectPricing}
                        value={projectIdSpecific}
                        listClassname="hours"
                        placeholderClassname="profile-title"
                        placeholder="Min"
                      />
                    </InputGroup>
                  </div>
                </div>
                <div className="order-confirm-name">
                  <div className="main-img">
                    <img
                      src={`${
                        bookingDetail.therapist_photo
                          ? bookingDetail.therapist_photo
                          : '/images/avatar.png'
                      }`}
                    />
                  </div>
                  <div className="specialist-info">
                    <h4 className="sub-title">
                      {!isEmpty(bookingDetail.therapist_name)
                        ? bookingDetail.therapist_name
                        : '-'}
                    </h4>
                    <div className="location">
                      {!isEmpty(bookingDetail)
                        ? !isEmpty(bookingDetail.address)
                          ? bookingDetail.address
                          : '-'
                        : '-'}
                      {' - '}
                      {!isEmpty(bookingDetail?.address_description)
                        ? bookingDetail?.address_description
                        : ''}
                    </div>
                    {!isEmpty(bookingDetail.parking_description) && (
                      <div>
                        {bookingDetail.parking ? 'Free ' : ''}
                        Parking {' - '}
                        {bookingDetail.parking_description}
                      </div>
                    )}
                  </div>
                </div>
                <SeperatorStyle className="seperator" />
                <div className="price-breakdown">
                  <h4 className="sub-title order-title">Price Breakdown</h4>
                  <div className="payment-details">
                    <h4 className="sub-title price-label">Price</h4>
                    <h4 className="sub-title price">
                      {!isEmpty(bookingDetail?.pricing?.massage_price) &&
                        `${'CAD $'}${bookingDetail?.pricing?.massage_price}`}
                    </h4>
                  </div>
                  {!isEmpty(bookingDetail?.pricing?.discount) && (
                    <div className="payment-details discounts">
                      <h4 className="sub-title price-label">Discount</h4>
                      <h4 className="sub-title price">{`${'CAD $'}${
                        bookingDetail?.pricing?.discount
                      }`}</h4>
                    </div>
                  )}
                  <div className="payment-details">
                    <h4 className="sub-title price-label">GST</h4>
                    <h4 className="sub-title price">
                      {!isEmpty(bookingDetail?.pricing?.tax_amount) &&
                        `${'CAD $'}${bookingDetail?.pricing?.tax_amount}`}
                    </h4>
                  </div>
                  <div className="payment-details total-amount">
                    <h3 className="order-sub-title price-label">
                      Total amount
                    </h3>
                    <h3 className="order-sub-title price">
                      {!isEmpty(bookingDetail?.pricing) &&
                        `${'CAD $'}${getTotalAmount()}`}
                    </h3>
                  </div>
                </div>
                <CustomModal
                  show={
                    !isEmpty(router.query.info) &&
                    JSON.parse(router.query.info).confirm
                  }
                  onHide={() => console.log('')}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  backdrop="static"
                  className="modal-cancle desktop-alt massage-confirm"
                  header={
                    <>
                      <h5
                        className="modal-title d-sm-block"
                        id="exampleModalLabel"
                      >
                        Your massage has been confirmed
                      </h5>
                    </>
                  }
                  footer={
                    <Button className="btn d-sm-block" onClick={handleConfirm}>
                      Ok
                    </Button>
                  }
                />
                <CustomModal
                  show={reviewModalShow}
                  onHide={() => setReviewModalShow(false)}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  className="modal-cancle desktop-alt modal-massage"
                  container={() =>
                    document.querySelector('.order-confirm-wrapper')
                  }
                  header={
                    <>
                      <AnimatePresence>
                        {isModalSuccessError && (
                          <motion.div
                            className="alert-wrapper"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            exit={{ opacity: 0 }}
                          >
                            <Alert variant={'error'}>{modalErrorMessage}</Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <h5
                        className="modal-title d-none d-sm-block"
                        id="exampleModalLabel"
                      >
                        {`${'Rate your massage with'} ${
                          !isEmpty(bookingDetail.therapist_name) &&
                          bookingDetail.therapist_name
                        }`}
                      </h5>
                      <h5
                        className="modal-title d-block d-sm-none"
                        id="exampleModalLabel"
                      >
                        Rate your experience
                      </h5>
                    </>
                  }
                  body={
                    <>
                      <h5 className="modal-title d-block d-sm-none">
                        {`${'Rate your massage with'} ${
                          !isEmpty(bookingDetail.therapist_name) &&
                          bookingDetail.therapist_name
                        }`}
                      </h5>
                      <ul className="list-unstyled">{ratingData()}</ul>
                      <div className="badges">
                        <div>You can choose up to three badges</div>
                        <Slider {...settings} className="slider">
                          {endorsementData()}
                        </Slider>
                      </div>
                      <form>
                        <div className="form-group">
                          <label>Leave a review about your visit.</label>
                          <textarea
                            className={`${
                              commentError ? 'form-error' : ''
                            } ${'form-control'}`}
                            placeholder="Write something…"
                            rows="4"
                            onChange={handleCommentChange}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label>Some personal feedback</label>
                          <textarea
                            className="form-control"
                            placeholder="Write private notes to Name Surname, other users won’t see it"
                            rows="4"
                            onChange={handleFeedbackChange}
                          ></textarea>
                        </div>
                      </form>
                    </>
                  }
                  footer={
                    <>
                      <Button
                        className="btn btn-white d-none d-sm-block"
                        onClick={() => setReviewModalShow(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className={`${
                          isEmpty(endorsementKey) || isEmpty(commentData)
                            ? 'disabled'
                            : ''
                        }`}
                        onClick={handleReview}
                      >
                        Leave a review
                      </Button>
                    </>
                  }
                />
                <CustomModal
                  show={tipmodalShow}
                  onHide={() => setTipModalShow(false)}
                  size="lg"
                  container={() =>
                    document.querySelector('.order-confirm-wrapper')
                  }
                  className="modal-cancle desktop-alt"
                  header={
                    <>
                      <AnimatePresence>
                        {isModalSuccessError && (
                          <motion.div
                            className="alert-wrapper"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            exit={{ opacity: 0 }}
                          >
                            <Alert variant={'error'}>{modalErrorMessage}</Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <h5 className="modal-title" id="exampleModalLabel">
                        Add a tip for{' '}
                        {!isEmpty(bookingDetail.therapist_name) &&
                          bookingDetail.therapist_name}
                      </h5>
                    </>
                  }
                  body={
                    <>
                      <div>
                        Your massage costs{' '}
                        {`${'$'}${
                          !isEmpty(bookingDetail) && getTotalAmount()
                        } ${'CAD'}`}
                      </div>
                      <div className="tip-section">
                        <div className="time-slot">
                          <a onClick={handleAmount}>
                            <span
                              className={`${
                                activeTip == '10%' ? 'active' : ''
                              } ${'badge'}`}
                            >
                              10%
                            </span>
                          </a>
                          <a onClick={handleAmount}>
                            <span
                              className={`${
                                activeTip == '15%' ? 'active' : ''
                              } ${'badge'}`}
                            >
                              15%
                            </span>
                          </a>
                          <a onClick={handleAmount}>
                            <span
                              className={`${
                                activeTip == '20%' ? 'active' : ''
                              } ${'badge'}`}
                            >
                              25%
                            </span>
                          </a>
                        </div>
                        <a className="link" onClick={handleEdit}>
                          {addInput ? (
                            <InputGroup isCustom>
                              <Input
                                type="number"
                                placeholder="Amount"
                                name="amount"
                                onChange={(e) => handleInputChange(e)}
                              />
                            </InputGroup>
                          ) : (
                            'Enter custom amount'
                          )}
                        </a>
                      </div>
                    </>
                  }
                  footer={
                    <>
                      <Button
                        className="btn btn-white d-none d-sm-block"
                        onClick={() => setTipModalShow(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className={`${
                          tipAmount ? '' : 'disabled'
                        } ${'btn mobile-btn'}`}
                        onClick={handleTip}
                      >
                        Pay
                      </Button>
                    </>
                  }
                />
                <CustomModal
                  show={cancelConfirmModalShow}
                  onHide={() => setCancelConfirmModalShow(false)}
                  size="lg"
                  container={() =>
                    document.querySelector('.order-confirm-wrapper')
                  }
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
                <div className="login-option button-wrapper text-center">
                  {!isEmpty(userProfile) ? (
                    !isEmpty(bookingDetail) ? (
                      showActionBtns()
                    ) : (
                      ''
                    )
                  ) : (
                    <>
                      <Button
                        className="login"
                        href={`/login?redirectFrom=${router.asPath}`}
                      >
                        Log in to continue
                      </Button>
                      <span className="signup-opt w-100">
                        Don't have an account?{' '}
                        <a href={`/signup?redirectFrom=${router.asPath}`}>
                          Sign up
                        </a>
                      </span>
                    </>
                  )}
                  <CustomModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="lg"
                    container={() =>
                      document.querySelector('.order-confirm-wrapper')
                    }
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
                          {isSchedule
                            ? 'Reschedule your order'
                            : 'Cancel your order'}
                        </h5>
                      </>
                    }
                    body={
                      <div className="confirm-content">{cancleMessage}</div>
                    }
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
                    container={() =>
                      document.querySelector('.order-confirm-wrapper')
                    }
                    className="modal-cancle desktop-alt"
                    header={
                      <h5 className="modal-title" id="exampleModalLabel">
                        Enter an email you're likely to receive your receipt
                        to..
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
                </div>
              </div>
            </Container>
          </ModalStyleWrapper>
        </OrderStyleWrapper>

        {/* Footer Section */}
        <Footer />
      </div>
    </PageLoader>
  );
}

const PaymentTypeList = [
  {
    id: 'addnew',
    value: 'Add New',
  },
  {
    id: 'CA',
    value: 'Pay by cash',
  },
];
