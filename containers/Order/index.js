import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import qs from 'qs';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import momenttz from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import ErrorAlert from 'components/ErrorAlert';
import isEmpty from 'lodash.isempty';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { OrderStyleWrapper } from './order.style';
import {
  getProjectPricingPerTherapist,
  getTherapistData,
  getTherapistAvailability,
  bookMassageAppoinment,
  createBookingGuest,
  getBookingGuests,
  getValidDiscount,
  consentIntakeForm,
} from 'redux/app/actions';
import {
  getUserProfileData,
  getCreditCards,
  addCard,
  userEmailUpdate,
} from 'redux/auth/actions';
import CustomDropdown from 'components/Base/Dropdown';
import { cardRegex, timezoneRegexFormat } from 'util/config';
import InputMask from 'react-input-mask';
import CustomModal from 'components/Base/Modal';
import CustomChipBanner from 'components/Base/ChipBanner';

const Cardschema = yup.object().shape({
  card_name: yup
    .string()
    .required('Please enter the card number')
    .matches(cardRegex, 'Please enter valid card number'),
  card_date: yup
    .string()
    .required('Please enter the date')
    .matches(
      /^(1[0-2]|0[1-9]|\d)\/([2-9]\d[1-9]\d|[1-9]\d)$/,
      'Please enter valid date'
    ),
  card_cvv: yup
    .string()
    .required('Please enter the cvv')
    .matches(/^[0-9]{3,4}$/, 'Please enter valid card cvv'),
});

export default function PlaceOrder() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const therapistPerAvailability = useSelector(
    (state) => state.app.therapistPerAvailability
  );
  const therapistIndividual = useSelector(
    (state) => state.app.therapistIndividual
  );

  const guestList = useSelector((state) => state.app.guestList);
  const errorBackend = useSelector((state) => state.auth.error);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const creditCards = useSelector((state) => state.auth.creditCards);
  const dispatch = useDispatch();
  const router = useRouter();

  const isLoggedIn = isEmpty(userProfile) ? false : true;

  let [projectIdSpecific, setProjectIdSpecific] = useState(0);
  let [typeIdSpecific, setTypeIdSpecific] = useState(0);
  let [projectPricing, setProjectPricing] = useState([]);
  let [projectPrice, setPricing] = useState([]);
  let [dateValue, setDateTime] = useState(new Date());
  let [specialistValue, setSpecialistArr] = useState([]);
  let [creditCardData, setCreditCardData] = useState([]);
  let [currentCard, setCurrentCard] = useState(null);
  let [discountValid, setDiscountValid] = useState(false);
  let [currentPaymentType, setCurrentPaymentType] = useState(null);
  let [availabilityData, setAvailabilityData] = useState({});
  let [modalShow, setModalShow] = useState(false);
  let [email, setEmail] = useState();
  let [cancelModalShow, setCancelModalShow] = useState(false);
  let [bookingNameModalShow, setBookingNameModalShow] = useState(false);
  let [bookingName, setBookingName] = useState();
  let [defaultName, setDefaultName] = useState([]);
  let [guestData, setGuestData] = useState([]);
  let [currentGuest, setCurrentGuest] = useState(0);
  let [modalConfirmShow, setModalConfirmShow] = useState(false);
  let [confirmData, setConfirmData] = useState();

  // Add Credit Card Form
  const {
    register: cardRegister,
    handleSubmit: cardHandleSubmit,
    errors: cardErrors,
    reset: cardReset,
    control: cardControl,
  } = useForm({
    validationSchema: Cardschema,
    defaultValues: {
      card_name: '',
      card_date: '',
      card_cvv: '',
    },
  });

  //   Mount
  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      if (!isEmpty(router.query.order)) {
        fetchData(router.query.order);
      }
    }
    fetchUserData();
  }, []);

  // Get Credit Card
  useEffect(() => {
    let creditList = [];
    if (!isEmpty(creditCards)) {
      creditCards.map((element) => {
        creditList.push({
          id: element.id,
          value: `${element.card_brand} ${element.card_last_four}`,
        });
        if (element.default_card) {
          setCurrentCard(element.id);
          setCurrentPaymentType(element.id);
        }
      });
      setCreditCardData([...creditList, ...PaymentTypeList]);
    } else {
      setCreditCardData([...PaymentTypeList]);
    }
  }, [creditCards]);

  useEffect(() => {
    let guest = [];
    if (!isEmpty(guestList)) {
      guestList.map((element) => {
        guest.push({
          id: element.id,
          value: element.fullname,
        });
      });
      setGuestData([...guest, ...defaultName]);
    } else {
      setGuestData([]);
    }
  }, [guestList]);

  useEffect(() => {
    if (!isEmpty(userProfile)) {
      let dataUser = {};
      dataUser.id = 0;
      dataUser.value = `${userProfile.firstname} ${userProfile.lastname}`;
      setDefaultName([dataUser]);
      setCurrentGuest(0);
    }
  }, [userProfile]);

  // Get Therapist Per Availability
  useEffect(() => {
    let availability = {};
    if (!isEmpty(therapistPerAvailability)) {
      therapistPerAvailability.map((element) => {
        if (element.display_time == JSON.parse(router.query.info).time) {
          (availability['start'] = element.start),
            (availability['end'] = element.end);
        }
      });
      setAvailabilityData(availability);
    }
  }, [therapistPerAvailability]);

  const fetchUserData = async () => {
    let { status } = await dispatch(getUserProfileData(true));
    if (status) await dispatch(getCreditCards());
    await dispatch(getBookingGuests());
  };

  const fetchData = async (slug) => {
    if (!isEmpty(JSON.parse(router.query.info).dateTime)) {
      setDateTime(JSON.parse(router.query.info).dateTime);
    }
    // Get ProjectPricing
    let projectRes = await dispatch(getProjectPricingPerTherapist({ slug }));

    if (!isEmpty(projectRes) && projectRes.status) {
      if (!isEmpty(projectRes.data)) {
        setProjectPricing(
          projectRes.data.map((element) => {
            return {
              id: element.id,
              value: element.description,
            };
          })
        );
        setPricing(
          projectRes.data.map((element) => {
            return {
              id: element.id,
              price: element.pricing,
            };
          })
        );

        setProjectIdSpecific(Number(JSON.parse(router.query.info).projectId));
      }
    }

    // Get discount validity
    let discountRes = await dispatch(getValidDiscount({ slug }));
    if (!isEmpty(discountRes) && projectRes.status) {
      if (!isEmpty(discountRes.data)) {
        setDiscountValid(discountRes.data['discount-valid']);
      }
    }

    // Get Availability of Therapist
    let projectId = 0;
    if (JSON.parse(router.query.info).projectId) {
      dispatch(
        getTherapistAvailability({
          slug: router.query.order,
          projectId: JSON.parse(router.query.info).projectId,
          dateTime: JSON.parse(router.query.info).dateTime,
        })
      );
      let { data, status } = await dispatch(
        getTherapistData({
          slug: router.query.order,
          projectId: JSON.parse(router.query.info).projectId,
          dateTime: JSON.parse(router.query.info).dateTime,
        })
      );
      if (status && !isEmpty(data[0])) {
        if (!isEmpty(data[0].manager_specialities)) {
          setSpecialistArr(
            data[0].manager_specialities.map((element) => {
              return {
                id: element.code,
                value: element.description,
              };
            })
          );
          let defaultExist = false;
          data[0].manager_specialities.map((element) => {
            if (element.default) {
              defaultExist = true;
              projectId = element.code;
              setTypeIdSpecific(element.code);
            }
          });
          if (!defaultExist) {
            setTypeIdSpecific(data[0].manager_specialities[0].code);
            projectId = data[0].manager_specialities[0].code;
          }
        }
      }
    }
  };

  const handleProjectChange = (data) => {
    projectPricing.map((list) => {
      if (list.id === data.id) setProjectIdSpecific(data.id);
    });

    if (data.id !== projectIdSpecific) {
      dispatch(
        getTherapistAvailability({
          slug: router.query.order,
          projectId: data.id,
          dateTime: dateValue,
        })
      );
    }
  };

  const handleTypeChange = (data) => {
    specialistValue.map((list) => {
      if (list.id === data.id) setTypeIdSpecific(data.id);
    });
  };

  const convertDate = (date) => {
    if (!isEmpty(router.query)) {
      let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      let temp_date = date[0].split('-');
      return (
        temp_date[2] +
        ' ' +
        months[Number(temp_date[1]) - 1] +
        ', ' +
        temp_date[0]
      );
    }
  };

  const onSubmitCard = async (data) => {
    let dateArr = data.card_date.split('/');
    let card_name = data.card_name.replace(/-/g, '');
    let payload = {
      'card[number]': card_name,
      'card[exp_month]': dateArr[0],
      'card[exp_year]': dateArr[1],
      'card[cvc]': data.card_cvv,
    };

    let { status } = await dispatch(addCard(payload));
    if (status) {
      cardReset({
        card_name: '',
        card_date: '',
        card_cvv: '',
      });
    }
  };

  const handleCardEdit = () => {
    cardReset({
      card_name: '',
      card_date: '',
      card_cvv: '',
    });
  };

  const handlePayment = (data) => {
    creditCardData.map((list) => {
      if (list.id === data.id) setCurrentCard(data.id);
    });
  };

  const handlePaymentType = (data) => {
    setCurrentPaymentType(data.id);
  };

  const handleGuestChange = (data) => {
    setCurrentGuest(data.id);
    setDefaultName([data]);
    setBookingNameModalShow(false);
  };

  const handleClick = () => {
    if (!isEmpty(userProfile.email)) {
      handlePay();
    } else {
      setModalShow(true);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setBookingName(e.target.value);
  };

  const handlePay = async () => {
    let payload = {
      paid_by: `${
        currentPaymentType == 'CA' || currentPaymentType == 'DB'
          ? currentPaymentType
          : 'CR'
      }`,
      app_source: 'web',
      start: `${
        availabilityData && availabilityData.start
          ? availabilityData.start
          : JSON.parse(router.query.info).start
      }`,
      end: `${
        availabilityData && availabilityData.end
          ? availabilityData.end
          : JSON.parse(router.query.info).end
      }`,
      userTimezone:
        momenttz.tz.guess().replace(timezoneRegexFormat, '_') ||
        'America_Regina',
      card_id: `${
        currentPaymentType == 'CA' ||
        currentPaymentType == 'DB' ||
        isNaN(currentPaymentType)
          ? ''
          : currentPaymentType
      }`,
    };
    if (defaultName[0].id !== 0) {
      payload.userguest_id = defaultName[0].id;
    }
    if (projectIdSpecific) {
      let { status, data } = await dispatch(
        bookMassageAppoinment({
          slug: router.query.order,
          projectId: projectIdSpecific,
          managerspecialityId: typeIdSpecific,
          payload,
        })
      );

      if (status) {
        setConfirmData(data.data);
        setModalConfirmShow(true);

        const durationValuePayload = projectPricing.find(
          (element) => element.id === projectIdSpecific
        );
        /* FBP Detail Cart */
        // window.fbq('trackCustom', 'checkout_comeplete', {
        //   actionItem: 'booked',
        //   data: {
        //     id: router.query.specialist,
        //     list_name: therapistIndividual.city,
        //     massage_date: data.start,
        //     duration: durationValuePayload.description,
        //   },
        //   event_label: router.query.specialist,
        //   event_category: 'cart',
        // });

        /* Gtag Detail Cart */
        window.dataLayer.push({
          event: 'checkoutCart',
          event_label: therapistIndividual.slug,
          event_category: 'cart',
          actionItem: 'booked',
          data: null,
        });

        //router.push(`/consent-form?url=${data.data['covid-form']}`);
        // router.push(
        //   `/order-detail/[detail]?info=${JSON.stringify({ confirm: true })}`,
        //   `/order-detail/${
        //     data.data.booking.booking_slug
        //   }?info=${JSON.stringify({
        //     confirm: true,
        //   })}`
        // );
      }
    }
  };

  // FIXME - Need to confirm
  const addEmail = async () => {
    let payload = {
      email: receiptEmail,
    };
    if (!isEmpty(userProfile) && !isEmpty(userProfile.lastname)) {
      payload.lastname = userProfile.lastname;
    }
    let { status } = await dispatch(userEmailUpdate(payload));
    if (status) {
      handlePay();
    }
  };

  const getTotalAmount = (pricing) => {
    let totalDiscount = 0;
    let totalTax = 0;

    if ((!isLoggedIn || discountValid) && pricing.discount) {
      totalDiscount = parseFloat(pricing.discount);
    }

    if (pricing.taxes) {
      totalTax = parseFloat(pricing.taxes);
    }

    return `${(parseFloat(pricing.amount) - totalDiscount + totalTax).toFixed(
      2
    )}`;
  };

  const handleBackClick = () => {
    if (!isEmpty(therapistIndividual)) {
      // const durationValuePayload = projectPricing.find(
      //   (element) => element.id === projectIdSpecific
      // );

      /* FBP Order Remove Cart */
      // window.fbq('trackCustom', 'remove_from_cart', {
      //   actionItem: 'cancel',
      //   data: {
      //     id: router.query.order,
      //     list_name: therapistIndividual.city,
      //     massage_date: JSON.parse(router.query.info).dateTime.toString(),
      //     duration: durationValuePayload.description,
      //   },
      //   event_label: router.query.specialist,
      //   event_category: 'cart',
      // });

      /* Gtag Order Remove Cart */
      window.dataLayer.push({
        event: 'removedFromCart',
        event_label: therapistIndividual.slug,
        event_category: 'cart',
        actionItem: 'cancel',
        data: null,
      });
    }

    router.back();
  };

  const handleRedirect = async (type) => {
    const query = new URLSearchParams(
      confirmData?.['intake-form']?.intakeFormAPIUrl
    );
    type == 'intake'
      ? router.push({
          pathname: `/intake-form/${query.get('form')}`,
          query: {
            type: 'Active',
            intake: confirmData?.['intake-form']?.intakeFormAPIUrl,
            covid: JSON.stringify(confirmData?.['covid-form']),
            booking: confirmData.booking.booking_slug,
            book_data: JSON.stringify({
              therapist_name: confirmData.booking.therapist_name,
            }),
          },
        })
      : router.push({
          pathname: `/consent-form`,
          query: {
            covid: JSON.stringify(confirmData?.['covid-form']),
            booking: confirmData.booking.booking_slug,
            book_data: JSON.stringify({
              therapist_name: confirmData.booking.therapist_name,
            }),
          },
        });
  };

  const handleRedirectNewIntake = async () => {
    router.push({
      pathname: `/intake-form/new`,
      query: {
        type: 'new',
        intake: confirmData?.['intake-form']?.intakeFormAPIUrl,
        covid: JSON.stringify(confirmData?.['covid-form']),
        booking: confirmData.booking.booking_slug,
        book_data: JSON.stringify({
          therapist_name: confirmData.booking.therapist_name,
        }),
      },
    });
  };

  const handleRedirectOrder = async () => {
    let payload = {
      url: confirmData['intake-form']?.intakeFormAPIUrl,
      data: {
        modifier: 'C',
      },
    };
    const { status } = await dispatch(consentIntakeForm(payload));
    if (status) {
      router.push({
        pathname: '/consent-form',
        query: {
          covid: JSON.stringify(confirmData['covid-form']),
          booking: confirmData.booking.booking_slug,
          book_data: JSON.stringify({
            therapist_name: confirmData.booking.therapist_name,
          }),
        },
      });
    }
  };

  const handleRedirectIntakeUpdate = async () => {
    const query = new URLSearchParams(
      confirmData?.['intake-form']?.intakeFormAPIUrl
    );
    router.push({
      pathname: `/intake-form/${query.get('form')}`,
      query: {
        intake: confirmData?.['intake-form']?.intakeFormAPIUrl,
        covid: JSON.stringify(confirmData?.['covid-form']),
        booking: confirmData.booking.booking_slug,
        book_data: JSON.stringify({
          therapist_name: confirmData.booking.therapist_name,
        }),
      },
    });
  };

  const handleGuest = async () => {
    let { status, data } = await dispatch(
      createBookingGuest({ fullname: bookingName })
    );
    if (status) {
      await dispatch(getBookingGuests());
      let therapist = {};
      therapist.id = data.data[data.data.length - 1].id || 0;
      therapist.value = bookingName;
      setDefaultName([therapist]);
      setCurrentGuest(data.data[data.data.length - 1].id || 0);
      setBookingNameModalShow(false);
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Place Order - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="header-white" />

        {/* Banner Section */}
        <OrderStyleWrapper>
          <Container>
            {/* Error Alert */}
            {errorBackend && typeof errorBackend === 'string' && (
              <ErrorAlert message={errorBackend} />
            )}
            <div className="order-confirm-wrapper">
              <a onClick={() => handleBackClick()} className="back-arrow">
                <img src="/images/left.svg" />
              </a>
              <div className="order-header">
                <CustomModal
                  show={modalConfirmShow}
                  onHide={() => console.log('')}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  backdrop="static"
                  className="modal-cancle desktop-alt massage-confirm consent-popup"
                  header={
                    <>
                      <h5
                        className="modal-title d-sm-block"
                        id="exampleModalLabel"
                      >
                        Massage Confirmed
                      </h5>
                    </>
                  }
                  body={
                    <div className="confirm-content">
                      {confirmData?.['intake-form']?.alreadyConsented
                        ? 'Would you like to update your intake form?'
                        : confirmData?.['intake-form']?.intakeForm
                        ? `${'Do you consent to share your intake form with '}${
                            therapistIndividual.manager_first_name
                          } ${therapistIndividual.manager_last_name}?`
                        : 'Please fill the intake form before your appointment.'}
                    </div>
                  }
                  footer={
                    <React.Fragment>
                      {confirmData?.['intake-form']?.alreadyConsented ? (
                        <>
                          <Button
                            className="btn d-sm-block"
                            onClick={() => handleRedirect('covid')}
                          >
                            Next
                          </Button>
                          <Button
                            className="btn d-sm-block"
                            onClick={() => handleRedirect('intake')}
                          >
                            Update
                          </Button>
                        </>
                      ) : confirmData?.['intake-form']?.intakeForm ? (
                        <>
                          <Button
                            className="btn d-sm-block"
                            onClick={handleRedirectOrder}
                          >
                            I consent
                          </Button>
                          <Button
                            className="btn d-sm-block"
                            onClick={handleRedirectIntakeUpdate}
                          >
                            Update
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="btn d-sm-block"
                          onClick={handleRedirectNewIntake}
                        >
                          Fill Form
                        </Button>
                      )}
                    </React.Fragment>
                  }
                />
                <div className="massage-date-time">
                  <h4 className="sub-title order-title">Your massage</h4>
                  <h3 className="order-sub-title">
                    {!isEmpty(router.query.info)
                      ? !isEmpty(JSON.parse(router.query.info).dateTime)
                        ? convertDate(
                            JSON.parse(router.query.info).dateTime.split(' ')
                          )
                        : '-'
                      : '-'}
                  </h3>
                  <h3 className="order-sub-title">
                    {!isEmpty(router.query.info)
                      ? !isEmpty(JSON.parse(router.query.info).time)
                        ? JSON.parse(router.query.info).time
                        : '-'
                      : '-'}
                  </h3>
                </div>
                <Button
                  varient="secondary"
                  onClick={() => setBookingNameModalShow(true)}
                >
                  Book for{' '}
                  {currentGuest
                    ? !isEmpty(defaultName)
                      ? defaultName[0].value
                      : 'someone else?'
                    : 'someone else?'}
                </Button>
                <CustomModal
                  show={bookingNameModalShow}
                  onHide={() => setBookingNameModalShow(false)}
                  size="lg"
                  className="modal-cancle desktop-alt"
                  container={() =>
                    document.querySelector('.order-confirm-wrapper')
                  }
                  header={
                    <h5 className="modal-title" id="exampleModalLabel">
                      Enter your name here..
                    </h5>
                  }
                  body={
                    <>
                      <div className="pay-option">
                        <div className="payment-option">
                          <div className="input-group">
                            <CustomDropdown
                              list={guestData}
                              value={currentGuest}
                              className="custom-dd guest-dd"
                              listClassname="payby"
                              placeholder="Select User"
                              handleDropdownChange={handleGuestChange}
                            />
                          </div>
                        </div>
                      </div>
                      <InputGroup isCustom>
                        <Input
                          type="text"
                          placeholder="Enter full name"
                          name="name"
                          onChange={handleNameChange}
                        />
                      </InputGroup>
                    </>
                  }
                  footer={
                    !isEmpty(userProfile) ? (
                      <Button
                        className={`${
                          bookingName ? '' : 'disabled'
                        } ${'btn mobile-btn'}`}
                        onClick={handleGuest}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        className="login"
                        href={`/login?redirectFrom=${router.asPath}`}
                      >
                        Log in to continue
                      </Button>
                    )
                  }
                />
              </div>
              <div className="massage-type">
                <h4 className="sub-title order-title">Type</h4>
                <div className="minutes-dropdown">
                  <InputGroup isCustom className="input-group">
                    <CustomDropdown
                      list={specialistValue}
                      value={typeIdSpecific}
                      listClassname="hours"
                      placeholderClassname="profile-title"
                      placeholder="Type"
                      handleDropdownChange={handleTypeChange}
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
                      handleDropdownChange={handleProjectChange}
                    />
                  </InputGroup>
                </div>
              </div>
              <div className="order-confirm-name">
                <div className="main-img">
                  {!isEmpty(therapistIndividual) ? (
                    therapistIndividual.profile_photo ? (
                      <img src={therapistIndividual.profile_photo} />
                    ) : (
                      <img src="/images/avatar.png" />
                    )
                  ) : (
                    <img src="/images/avatar.png" />
                  )}
                </div>
                <div className="specialist-info">
                  <h4 className="sub-title">
                    {!isEmpty(therapistIndividual)
                      ? `${therapistIndividual.manager_first_name} ${therapistIndividual.manager_last_name}`
                      : '-'}
                  </h4>
                  <div className="location">
                    {!isEmpty(therapistIndividual)
                      ? !isEmpty(therapistIndividual.address)
                        ? therapistIndividual.address
                        : '-'
                      : '-'}
                    {' - '}
                    {!isEmpty(therapistIndividual?.address_description)
                      ? therapistIndividual?.address_description
                      : ''}
                  </div>
                  {!isEmpty(therapistIndividual.parking_description) && (
                    <div>
                      {therapistIndividual.parking ? 'Free ' : ''}
                      Parking
                      {therapistIndividual.parking_description}
                    </div>
                  )}
                </div>
              </div>
              <SeperatorStyle className="seperator" />
              <div className="price-breakdown">
                <h4 className="sub-title order-title">Price Breakdown</h4>
                {(!isLoggedIn || discountValid) && !isEmpty(projectPrice) && (
                  <CustomChipBanner
                    children={
                      <span>
                        You saved{' '}
                        {projectPrice.map((data) => {
                          if (data.id == projectIdSpecific) {
                            return `${'CAD $'}${data.price.discount}`;
                          }
                        })}{' '}
                        on this massage
                      </span>
                    }
                  />
                )}
                <div className="payment-details">
                  <h4 className="sub-title price-label">Price</h4>
                  <h4 className="sub-title price">
                    {!isEmpty(projectPrice)
                      ? projectPrice.map((data) => {
                          if (data.id == projectIdSpecific) {
                            return `${'CAD $'}${data.price.amount}`;
                          }
                        })
                      : '-'}
                  </h4>
                </div>
                {(!isLoggedIn || discountValid) && (
                  <div className="payment-details discounts">
                    <h4 className="sub-title price-label">Discount</h4>
                    <h4 className="sub-title price">
                      {!isEmpty(projectPrice)
                        ? projectPrice.map((data) => {
                            if (data.id == projectIdSpecific) {
                              return `${'CAD $'}${data.price.discount}`;
                            }
                          })
                        : ''}
                    </h4>
                  </div>
                )}
                <div className="payment-details">
                  <h4 className="sub-title price-label">GST</h4>
                  <h4 className="sub-title price">
                    {!isEmpty(projectPrice)
                      ? projectPrice.map((data) => {
                          if (data.id == projectIdSpecific) {
                            return `${'CAD $'}${data.price.taxes}`;
                          }
                        })
                      : ''}
                  </h4>
                </div>
                <div className="payment-details total-amount">
                  <h3 className="order-sub-title price-label">Total amount</h3>
                  <h3 className="order-sub-title price">
                    {!isEmpty(projectPrice)
                      ? projectPrice.map((data) => {
                          if (data.id == projectIdSpecific) {
                            return `${'CAD $'}${getTotalAmount(data.price)}`;
                          }
                        })
                      : ''}
                  </h3>
                </div>
                <div className="login-option text-center">
                  <span className="signup-opt w-100">
                    <a onClick={() => setCancelModalShow(true)}>
                      Cancellation policy
                    </a>
                  </span>
                </div>
                <CustomModal
                  show={cancelModalShow}
                  onHide={() => setCancelModalShow(false)}
                  container={() => document.querySelector('.login-option')}
                  size="lg"
                  className="modal-cancle cancellation-popup desktop-alt"
                  header={
                    <>
                      <h4 className="modal-title d-sm-block">
                        Cancellation Policy
                      </h4>
                    </>
                  }
                  body={
                    <ul>
                      <li className="modal-list p-2 text-left">
                        You may cancel or reschedule your booking up to 1 hour
                        before your appointment with no penalty.
                      </li>
                      <li className="modal-list p-2 text-left">
                        If you reschedule with less than 1 hours' notice, you
                        will be charged 25% of your appointment fee.
                      </li>
                      <li className="modal-list p-2 text-left">
                        If you cancel with less than 1 hours' notice, you will
                        be charged a 50% of your appointment fee.
                      </li>
                      <li className="modal-list p-2 text-left">
                        If a therapist is not available for your booking, you
                        will not be charged.
                      </li>
                    </ul>
                  }
                  footer={
                    <Button
                      className="btn mobile-btn"
                      onClick={() => setCancelModalShow(false)}
                    >
                      Close
                    </Button>
                  }
                />
              </div>
              <SeperatorStyle className="seperator" />
              {!isEmpty(userProfile) ? (
                <div className="pay-option">
                  <h4 className="sub-title order-title">Pay options</h4>
                  <div className="payment-mode">
                    <div className="pay-check">
                      <div className="payment-option">
                        <div className="input-group">
                          <CustomDropdown
                            list={creditCardData}
                            value={currentPaymentType}
                            className="custom-dd"
                            listClassname="payby"
                            placeholder="Choose method"
                            handleDropdownChange={handlePaymentType}
                            type="payment"
                          />
                        </div>
                      </div>
                    </div>
                    {currentPaymentType == 'CR' && !isEmpty(creditCardData) ? (
                      <div className="payment-option">
                        <div className="input-group">
                          <CustomDropdown
                            list={creditCardData}
                            value={currentCard}
                            className="custom-dd"
                            listClassname="payby"
                            placeholder="Choose Card"
                            handleDropdownChange={handlePayment}
                            type="payment"
                          />
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    {currentPaymentType == 'addnew' ? (
                      <div className="new-payment-method">
                        <InputGroup isCustom>
                          <Controller
                            mask={'9999-9999-9999-9999'}
                            className="form-control"
                            placeholder="Card number"
                            as={
                              <InputMask>
                                {(maskProps) => (
                                  <Input
                                    {...maskProps}
                                    isInvalid={
                                      !isEmpty(cardErrors) &&
                                      !isEmpty(cardErrors.card_name)
                                    }
                                    autoComplete="off"
                                    refProps={cardRegister}
                                  />
                                )}
                              </InputMask>
                            }
                            control={cardControl}
                            name="card_name"
                          />
                          {!isEmpty(cardErrors) && cardErrors.card_name && (
                            <Form.Control.Feedback type="invalid">
                              {cardErrors.card_name.message}
                            </Form.Control.Feedback>
                          )}
                        </InputGroup>
                        <div className="input-group-wrapper">
                          <InputGroup isCustom>
                            <Controller
                              mask={'99/99'}
                              className="form-control"
                              placeholder="MM/YY"
                              as={
                                <InputMask>
                                  {(maskProps) => (
                                    <Input
                                      {...maskProps}
                                      isInvalid={
                                        !isEmpty(cardErrors) &&
                                        !isEmpty(cardErrors.card_date)
                                      }
                                      refProps={cardRegister}
                                    />
                                  )}
                                </InputMask>
                              }
                              control={cardControl}
                              name="card_date"
                            />
                            {!isEmpty(cardErrors) && cardErrors.card_date && (
                              <Form.Control.Feedback type="invalid">
                                {cardErrors.card_date.message}
                              </Form.Control.Feedback>
                            )}
                          </InputGroup>
                          <InputGroup isCustom>
                            <Input
                              refProps={cardRegister}
                              name="card_cvv"
                              isInvalid={
                                !isEmpty(cardErrors) &&
                                !isEmpty(cardErrors.card_cvv)
                              }
                              placeholder="CVC/CVV"
                            />
                            {!isEmpty(cardErrors) && cardErrors.card_cvv && (
                              <Form.Control.Feedback type="invalid">
                                {cardErrors.card_cvv.message}
                              </Form.Control.Feedback>
                            )}
                          </InputGroup>
                        </div>
                        <div className="action-btn">
                          <a className="btn cancel" onClick={handleCardEdit}>
                            Cancel
                          </a>
                          <Button onClick={cardHandleSubmit(onSubmitCard)}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className="login-option text-center d-flex flex-column align-items-center">
                {!isEmpty(userProfile) ? (
                  currentPaymentType == 'CA' ||
                  currentPaymentType == 'DB' ||
                  (!isNaN(currentPaymentType) &&
                    currentPaymentType !== null) ? (
                    <Button
                      className="login button-content mb-3"
                      onClick={handleClick}
                    >
                      Reserve Spot
                    </Button>
                  ) : (
                    <Button className="btn disabled button-content mb-3">
                      Reserve Spot
                    </Button>
                  )
                ) : (
                  <Button
                    className="login button-content mb-3"
                    href={`/login?redirectFrom=${router.asPath}`}
                  >
                    Log in to continue
                  </Button>
                )}
                <span className="button-subtext">
                  You are only charged after the appointment
                </span>
                {!isEmpty(userProfile) ? (
                  ''
                ) : (
                  <span className="signup-opt w-100">
                    Don&apos;t have an account?{' '}
                    <a href={`/signup?redirectFrom=${router.asPath}`}>
                      Sign up
                    </a>
                  </span>
                )}
                <CustomModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  size="lg"
                  className="modal-cancle desktop-alt"
                  header={
                    <h5 className="modal-title" id="exampleModalLabel">
                      If you would like to receive an email to confirm your
                      booking, please enter one now.
                    </h5>
                  }
                  body={
                    <InputGroup isCustom>
                      <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </InputGroup>
                  }
                  footer={
                    <Button className="btn mobile-btn" onClick={addEmail}>
                      Reserve Spot
                    </Button>
                  }
                />
              </div>
            </div>
          </Container>
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
    value: 'Add New Card',
  },
  {
    id: 'CA',
    value: 'Cash',
  },
  {
    id: 'DB',
    value: 'Direct Billing',
  },
];
