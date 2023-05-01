import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import momenttz from 'moment-timezone';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Datepicker from 'components/Base/Datepicker';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import InputGroup from 'components/Base/InputGroup';
import Input from 'components/Base/Input';
import * as yup from 'yup';
import axios from 'axios';
import Button from 'components/Base/Button';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { RequestStyleWrapper } from './requestDemo.style';
import InputMask from 'react-input-mask';
import { useRouter } from 'next/router';
import CustomDropdown from 'components/Base/Dropdown';
import { getRequestDemo, setRequestDemo } from 'redux/app/actions';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
});

export default function RequestDemo() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const errorBackend = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedTimezone, setSelectedTimezone] = useState({
    id: 190,
    value: 'America/Regina',
  });
  const [timeSlot, setTimeSlot] = useState([]);
  const [cityBanner, setCityBanner] = useState(
    'RMTs in your area made $XXX in the last week'
  );
  const [selectedSlot, setSelectedSlot] = useState({});
  const [timeZones, setTimeZones] = useState({});
  const [pageKey, setPageKey] = useState(1);
  const [success, setSuccess] = useState(false);
  const [dateValue, setDateTime] = useState(new Date());
  const [redirectFrom, setRedirectFrom] = useState('/');
  const InitialFormData = {
    email: router?.query?.email || '',
    name: '',
    phone: '',
  };
  const { register, handleSubmit, control, errors, setValue } = useForm({
    validationSchema: schema,
    defaultValues: {
      ...InitialFormData,
    },
  });

  //   Mount
  useEffect(() => {
    const zones = [];
    momenttz.tz.names().map((data, i) => {
      zones.push({
        id: i,
        value: data,
      });
    });

    setTimeZones(zones);

    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
    }

    fetchUserData();
  }, []);

  //  Change in Date
  useEffect(() => {
    changeInDateValue();
  }, [dateValue]);

  const changeInDateValue = async () => {
    let date = `${new Date(dateValue).getFullYear()}-${
      new Date(dateValue).getMonth() + 1
    }-${new Date(dateValue).getDate()}`;
    let timezone = selectedTimezone.value.replace('/', '_');
    let payload = {
      timezone,
      date,
    };
    let { status, data } = await dispatch(getRequestDemo(payload));
    if (status) {
      if (data.data.length !== 0) {
        setTimeSlot(data.data);
      }
    }
  };

  const fetchUserData = async () => {
    let date = momenttz.tz(selectedTimezone.value).format().split('T')[0];
    let timezone = selectedTimezone.value.replace('/', '_');
    let payload = {
      timezone,
      date,
    };
    let responseCityBanner = await axios.get(
      process.env.API_URL + '/city-banner'
    );
    if (
      responseCityBanner.status === 200 &&
      !isEmpty(responseCityBanner.data)
    ) {
      setCityBanner(responseCityBanner.data.message);
    }

    let { status, data } = await dispatch(getRequestDemo(payload));
    if (status) {
      if (data.data.length !== 0) {
        setTimeSlot(data.data);
      }
    }
  };

  const handleTimeChange = async (event) => {
    setSelectedTimezone(event);
    let date = `${new Date(dateValue).getFullYear()}-${
      new Date(dateValue).getMonth() + 1
    }-${new Date(dateValue).getDate()}`;
    let timezone = event.value.replace('/', '_');
    let payload = {
      timezone,
      date,
    };
    let { status, data } = await dispatch(getRequestDemo(payload));
    if (status) {
      if (data.data.length !== 0) {
        setTimeSlot(data.data);
      }
    }
  };

  const handleSelectSlot = (data) => {
    setSelectedSlot(data);
    setPageKey(2);
  };

  const onSubmit = async (data) => {
    let payload = {
      name: data.name,
      email: data.email,
      timezone: selectedTimezone.value.replace('/', '_'),
      start: selectedSlot.start,
      end: selectedSlot.end,
      resource_id: selectedSlot.resources[0].id,
    };
    if (!isEmpty(data.phone)) {
      payload.phone = data.phone;
    }
    let { status } = await dispatch(
      setRequestDemo({
        timezone: selectedTimezone.value.replace('/', '_'),
        payload,
      })
    );
    if (status) {
      setSuccess(true);
    }
  };

  const handleDateChange = async (event) => {
    setDateTime(event);
  };

  const handleLeftSideClick = () => {
    const currentDate = new Date();
    const newDate = new Date();
    if (dateValue.getDate() === currentDate.getDate()) {
      return;
    }
    newDate.setDate(dateValue.getDate() - 1);
    setDateTime(newDate);
  };

  const handleRightSideClick = () => {
    const newDate = new Date();
    newDate.setDate(dateValue.getDate() + 1);
    setDateTime(newDate);
  };

  return (
    <RequestStyleWrapper>
      <PageLoader visible={loaderCount <= 0 ? false : true}>
        <div className="content-wrapper">
          <Head>
            <title>Request A Demo - Thrivr</title>
          </Head>

          {/* Header Section */}
          <Header activeLink="RequestDemo" className="form-header" />

          {/* Banner Section */}
          <section
            className={`banner-wrapper d-flex${
              pageKey == 1 ? ' banner-time-wrapper' : ''
            }`}
          >
            <Container className="m-auto position-relative">
              {/* Alert Error Message */}
              <AnimatePresence>
                {!isEmpty(errorBackend) && (
                  <motion.div
                    className="alert-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert variant={'error'}>{errorBackend}</Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="form-details">
                <h2 className="main-title d-none d-sm-none d-md-block">
                  {cityBanner}
                </h2>
                <a
                  className="back-arrow d-block d-md-none"
                  onClick={() => router.push(`${redirectFrom}`)}
                >
                  <img src="/images/left.svg" />
                </a>
                <div
                  className={`form-wrapper${
                    pageKey == 1 ? ' time-form-wrapper' : ''
                  }`}
                >
                  {pageKey == 1 && (
                    <Form className="request-form">
                      <div className="form-title">Request a demo</div>
                      <div className="request-time">
                        Please pick a time slot that works for you
                      </div>
                      <div className="date-slider-wrapper">
                        <div className="date-slider">
                          <a onClick={handleLeftSideClick}>
                            <img
                              className="left-slide"
                              src="/images/down.svg"
                            />
                          </a>
                          <div className="calender-dropdown">
                            <InputGroup
                              isCustom
                              className="date-alt mob-half d-inline-block"
                            >
                              <Datepicker
                                dateClassName="form-control profile-title"
                                pastDateDisable={true}
                                value={dateValue}
                                handleDateChange={handleDateChange}
                              />
                            </InputGroup>
                          </div>
                          <a onClick={handleRightSideClick}>
                            <img
                              className="right-slide"
                              src="/images/down.svg"
                            />
                          </a>
                        </div>
                        <div className="slider-body time-slot">
                          {!isEmpty(timeSlot) &&
                            timeSlot.map((data, index) => (
                              <a
                                onClick={() => handleSelectSlot(data)}
                                key={index}
                              >
                                <span className="badge">{`${
                                  new Date(data.start).getHours() > 12
                                    ? new Date(data.start).getHours() - 12
                                    : new Date(data.start).getHours()
                                }:${
                                  new Date(data.start).getMinutes() == 0
                                    ? '00'
                                    : new Date(data.start).getMinutes()
                                } ${
                                  new Date(data.start).getHours() >= 12
                                    ? 'pm'
                                    : 'am'
                                }`}</span>
                              </a>
                            ))}
                        </div>
                        <div className="m-auto country-dropdown">
                          <div className="input-group">
                            <CustomDropdown
                              list={timeZones}
                              value={selectedTimezone.id}
                              className="custom-dd"
                              placeholder="Select User"
                              handleDropdownChange={handleTimeChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="request-msg">
                        On receiving, this one of our representatives will
                        contact you within 24 hours. We promise not to spam you.
                      </div>
                    </Form>
                  )}
                  {pageKey == 2 && (
                    <Form
                      className="request-form"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="form-title">Request a demo</div>
                      <div className="request-time">
                        <span>
                          {!isEmpty(selectedSlot) &&
                            `${moment(selectedSlot.start).format(
                              'MMMM DD, hh:mm a'
                            )} - ${moment(selectedSlot.end).format(
                              'hh:mm a'
                            )}`}{' '}
                        </span>
                        with the Thrivr team
                      </div>
                      <InputGroup isCustom>
                        <Input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name"
                          refProps={register}
                          isInvalid={
                            !isEmpty(errors) && !isEmpty(errors.name)
                              ? true
                              : false
                          }
                          //onChange={handleChange}
                        />
                      </InputGroup>
                      <InputGroup isCustom>
                        <Input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                          refProps={register}
                          isInvalid={
                            !isEmpty(errors) && !isEmpty(errors.email)
                              ? true
                              : false
                          }
                          //onChange={handleChange}
                        />
                      </InputGroup>
                      <InputGroup isCustom>
                        <Controller
                          mask="+1 (999) 999-9999"
                          className="form-control"
                          placeholder="Your phone number"
                          as={
                            <InputMask>
                              {(maskProps) => (
                                <Input
                                  {...maskProps}
                                  isInvalid={
                                    !isEmpty(errors) && !isEmpty(errors.phone)
                                  }
                                  refProps={register}
                                />
                              )}
                            </InputMask>
                          }
                          control={control}
                          name="phone"
                        />
                      </InputGroup>
                      <Button className="mob-full" type="submit">
                        Book
                      </Button>
                      <div className="request-msg">
                        On receiving, this one of our representatives will
                        contact you within 24 hours. We promise not to spam you.
                      </div>
                    </Form>
                  )}
                  {success && (
                    <div className="request-info">
                      <span>
                        We have received your message and will review it
                        shortly.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>

          {/* Footer Section */}
          <Footer />
        </div>
      </PageLoader>
    </RequestStyleWrapper>
  );
}
