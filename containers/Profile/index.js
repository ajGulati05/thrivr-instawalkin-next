import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import cx from 'classnames';
import isEmpty from 'lodash.isempty';
import PageLoader from 'components/Views/PageLoader';
import {
  getUserProfileData,
  profileUpdate,
  addCard,
  profileImageUpdate,
  deleteCard,
  changeDefaultCard,
  getCreditCards,
  notificationUpdate,
  getNotifications,
  resetPassword,
} from 'redux/auth/actions';
import Button from 'components/Base/Button';
import ErrorAlert from 'components/ErrorAlert';
import { SeperatorStyle } from 'components/StyleComponent';
import Input from 'components/Base/Input';
import InputGroup from 'components/Base/InputGroup';
import Footer from 'components/Footer';
import Header from 'components/Header';
import CustomDropdown from 'components/Base/Dropdown';
import ProfileStyleWrapper from './profile.style';
import { phoneRegex, cardRegex } from 'util/config';
import Alert from 'react-bootstrap/Alert';
import Router, { useRouter } from 'next/router';

const InitialEditFlag = {
  firstname: false,
  lastname: false,
  email: false,
  phone: false,
  password: false,
  primaryBilling: false,
  secondaryBilling: false,
};

const initialCardData = Object.freeze({
  card_number: '',
  card_expiry_date: '',
  card_cvv: '',
});

const Firstnameschema = yup.object().shape({
  firstname: yup.string().required('Please enter the firstname'),
});
const Lastnameschema = yup.object().shape({
  lastname: yup.string().required('Please enter the lastname'),
});
const Emailschema = yup.object().shape({
  email: yup.string().email().required('Please enter the email'),
});
const Phoneschema = yup.object().shape({
  phone: yup
    .string()
    .required()
    .matches(phoneRegex, 'Please enter valid phone number'),
});
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

const DetailTitle = ({ title }) => (
  <div className="detail-title">
    <h3 className="sub-title">{title}</h3>
  </div>
);

DetailTitle.propTypes = {
  title: PropTypes.string,
};

const PlaceholderTitle = ({
  title,
  onEditClick,
  isEdit,
  isCustomFunc,
  children,
}) => (
  <div
    className={cx('profile-edit', {
      'd-none': isEdit,
    })}
  >
    <h3 className="sub-title detail">{title}</h3>
    <ul className="list-unstyled">
      {!isCustomFunc ? (
        <li>
          <a className="edit" onClick={onEditClick}>
            Edit
          </a>
        </li>
      ) : (
        children
      )}
    </ul>
  </div>
);

PlaceholderTitle.propTypes = {
  title: PropTypes.string,
  isEdit: PropTypes.bool,
  onEditClick: PropTypes.func,
  isCustomFunc: PropTypes.bool,
  children: PropTypes.node,
};

function Profile() {
  // Redux
  const dispatch = useDispatch();
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const userProfileRedux = useSelector((state) => state.auth.userProfile);
  const creditCards = useSelector((state) => state.auth.creditCards);
  const NotificationData = useSelector((state) => state.auth.NotificationData);
  const authToken = useSelector((state) => state.auth.authToken);
  const errorBackend = useSelector((state) => state.auth.error);

  // State
  const [editFlagObj, setEditFlagObj] = useState({ ...InitialEditFlag });
  const [addNewCardFlag, setAddNewCardFlag] = useState(false);
  const [currentPaymentType, setCurrentPaymentType] = useState(0);
  const [profileFormData, setProfileFormData] = useState({
    ...userProfileRedux,
  });
  const [notification, setNotification] = useState([]);
  const [NotificationArray, setNotificationArray] = useState([]);

  // Form
  // Firstname
  const {
    register: firstNameRegister,
    handleSubmit: firstNameHandleSubmit,
    setValue: firstNameSetValue,
    errors: firstNameErrors,
    reset: firstNameReset,
  } = useForm({
    validationSchema: Firstnameschema,
    defaultValues: {
      firstname: '',
    },
  });

  // Lastname
  const {
    register: lastNameRegister,
    handleSubmit: lastNameHandleSubmit,
    setValue: lastNameSetValue,
    errors: lastNameErrors,
    reset: lastNameReset,
  } = useForm({
    validationSchema: Lastnameschema,
    defaultValues: {
      lastname: '',
    },
  });

  // Email
  const {
    register: emailRegister,
    handleSubmit: emailHandleSubmit,
    errors: emailErrors,
    reset: emailReset,
  } = useForm({
    validationSchema: Emailschema,
    defaultValues: {
      email: '',
    },
  });

  // Phone
  const {
    register: phoneRegister,
    handleSubmit: phoneHandleSubmit,
    setValue: phoneSetValue,
    errors: phoneErrors,
    reset: phoneReset,
    control: phoneControl,
  } = useForm({
    validationSchema: Phoneschema,
    defaultValues: {
      phone: '',
    },
  });

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

  // Mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // User Profile Compute
  useEffect(() => {
    setProfileFormData(userProfileRedux);
    if (!isEmpty(userProfileRedux)) {
      if (userProfileRedux.firstname) {
        firstNameSetValue('firstname', userProfileRedux.firstname);
      }
      if (userProfileRedux.lastname) {
        lastNameSetValue('lastname', userProfileRedux.lastname);
      }
      if (userProfileRedux.phone) {
        phoneSetValue('phone', userProfileRedux.phone);
      }
    }
  }, [userProfileRedux]);

  const fetchUserData = async () => {
    let { status } = await dispatch(getUserProfileData(true));
    let defaultArray = [];
    let defaultNotification = [];
    if (status) await dispatch(getCreditCards());
    let { data } = await dispatch(getNotifications());
    if (!isEmpty(data)) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          if (!data[key]) {
            defaultArray.push(key);
          } else {
            defaultNotification.push(key);
          }
        }
      }
      setNotificationArray(defaultArray);
      setNotification(defaultNotification);
    }
  };

  const handleCancel = (key, cbrest) => {
    cbrest({
      [key]:
        !isEmpty(userProfileRedux) && userProfileRedux[key]
          ? userProfileRedux[key]
          : '',
    });
    setEditFlagObj({ ...editFlagObj, [key]: false });
  };

  const handleEditOpen = (key) => {
    setEditFlagObj({ ...editFlagObj, [key]: true });
  };

  const handleCardEdit = () => {
    setAddNewCardFlag(!addNewCardFlag);
  };

  const handleDeleteCard = (data) => {
    dispatch(deleteCard({ id: data.id }));
  };

  const handleToDefault = (data) => {
    dispatch(changeDefaultCard({ id: data.id }));
  };

  const handlePaymentType = (data) => {
    PaymentTypeList.map((list) => {
      if (list.id === data.id) setCurrentPaymentType(data.id);
    });
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
      setAddNewCardFlag(false);
      cardReset({
        card_name: '',
        card_date: '',
        card_cvv: '',
      });
    }
  };

  const onSubmitFirstname = async (data) => {
    data.lastname = userProfileRedux.lastname;
    data.phone = userProfileRedux.phone;
    let { status } = await dispatch(profileUpdate(data));
    if (status) {
      setEditFlagObj({ ...editFlagObj, firstname: false });
    }
  };

  const onSubmitLastname = async (data) => {
    data.firstname = userProfileRedux.firstname;
    data.phone = userProfileRedux.phone;
    let { status } = await dispatch(profileUpdate(data));
    if (status) {
      setEditFlagObj({ ...editFlagObj, lastname: false });
    }
  };

  const onSubmitPhone = async (data) => {
    data.firstname = userProfileRedux.firstname;
    data.lastname = userProfileRedux.lastname;
    let { status } = await dispatch(profileUpdate(data));
    if (status) {
      setEditFlagObj({ ...editFlagObj, phone: false });
    }
  };

  const onSubmitEmail = () => {};

  const handleFileChange = async (event) => {
    if (
      !isEmpty(event) &&
      !isEmpty(event.target) &&
      !isEmpty(event.target.files)
    ) {
      let { status } = await dispatch(
        profileImageUpdate({ avatar: event.target.files[0] })
      );
      if (status) {
        event.value = '';
      }
    }
  };

  const handleCheckChange = async (event) => {
    let payload = {};
    if (notification.includes(event.target.id)) {
      let filterNotification = [...notification];
      const index = filterNotification.indexOf(event.target.id);
      if (index > -1) {
        filterNotification.splice(index, 1);
      }
      if (!isEmpty(filterNotification)) {
        filterNotification.map((data) => {
          payload[data] = 1;
        });
      }
      if (!isEmpty(NotificationArray)) {
        const exist = NotificationArray.indexOf(event.target.id);
        if (exist > -1) {
          NotificationArray.splice(exist, 1);
        }
        let NotificationArr = NotificationArray.filter(
          (val) => !filterNotification.includes(val)
        );
        if (!isEmpty(NotificationArr)) {
          NotificationArr.map((data) => {
            payload[data] = 0;
          });
        }
      }
      setNotification(filterNotification);
      setNotificationArray([...NotificationArray, event.target.id]);
      payload[event.target.id] = 0;
      await dispatch(notificationUpdate(payload));
    } else {
      if (!isEmpty(notification)) {
        notification.map((data) => {
          payload[data] = 1;
        });
      }
      if (!isEmpty(NotificationArray)) {
        const exist = NotificationArray.indexOf(event.target.id);
        if (exist > -1) {
          NotificationArray.splice(exist, 1);
        }
        let NotificationArr = NotificationArray.filter(
          (val) => !notification.includes(val)
        );
        if (!isEmpty(NotificationArr)) {
          NotificationArr.map((data) => {
            payload[data] = 0;
          });
        }
      }
      payload[event.target.id] = 1;
      setNotification([...notification, event.target.id]);
      await dispatch(notificationUpdate(payload));
    }
  };

  const redirectPassword = () => {
    Router.push('/password-change');
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <Head>
        <title>Profile - Thrivr</title>
      </Head>
      <Header className="header-white" />
      <ProfileStyleWrapper>
        <Container>
          {/* Error Alert */}
          {errorBackend && typeof errorBackend === 'string' && (
            <ErrorAlert message={errorBackend} />
          )}
          <div className="profile-main-wrapper">
            <div className="profile-sec">
              <h3 className="sub-title profile-title">General information</h3>
              <div className="profile-photo d-flex">
                <h3 className="sub-title">Profile photo</h3>
                <span className="ml-auto profile-img">
                  <Form.File id="profile-image-wrapper">
                    <Form.File.Label>
                      {!isEmpty(userProfileRedux) ? (
                        userProfileRedux.avatar ? (
                          <img src={userProfileRedux.avatar} />
                        ) : (
                          <img src={'/images/avatar.png'} />
                        )
                      ) : (
                        <img src={'/images/avatar.png'} />
                      )}
                    </Form.File.Label>
                    <Form.File.Input onChange={handleFileChange} />
                  </Form.File>
                </span>
              </div>
              <div className="profile-details">
                <DetailTitle title="First name" />
                <PlaceholderTitle
                  title={
                    !isEmpty(userProfileRedux)
                      ? userProfileRedux.firstname
                      : 'Name'
                  }
                  isEdit={editFlagObj.firstname}
                  onEditClick={() => handleEditOpen('firstname')}
                />
                <div
                  className={cx('edit-section', {
                    show: editFlagObj.firstname,
                  })}
                >
                  <InputGroup isCustom>
                    <Input
                      type="text"
                      placeholder={'Name'}
                      name="firstname"
                      refProps={firstNameRegister}
                      isInvalid={
                        !isEmpty(firstNameErrors) &&
                        !isEmpty(firstNameErrors.firstname)
                      }
                    />
                    {!isEmpty(firstNameErrors) && (
                      <Form.Control.Feedback type="invalid">
                        {firstNameErrors.firstname.message}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                  <div className="action-btn">
                    <a
                      className="cancel"
                      onClick={() => handleCancel('firstname', firstNameReset)}
                    >
                      Cancel
                    </a>
                    <Button onClick={firstNameHandleSubmit(onSubmitFirstname)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <DetailTitle title="Last name" />
                <PlaceholderTitle
                  title={
                    !isEmpty(userProfileRedux)
                      ? userProfileRedux.lastname
                      : 'Surname'
                  }
                  isEdit={editFlagObj.lastname}
                  onEditClick={() => handleEditOpen('lastname')}
                />
                <div
                  className={cx('edit-section', {
                    show: editFlagObj.lastname,
                  })}
                >
                  <InputGroup isCustom>
                    <Input
                      type="text"
                      placeholder={'Surname'}
                      name="lastname"
                      refProps={lastNameRegister}
                      isInvalid={
                        !isEmpty(lastNameErrors) &&
                        !isEmpty(lastNameErrors.lastname)
                      }
                    />
                    {!isEmpty(lastNameErrors) && (
                      <Form.Control.Feedback type="invalid">
                        {lastNameErrors.lastname.message}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                  <div className="action-btn">
                    <a
                      className="cancel"
                      onClick={() => handleCancel('lastname', lastNameReset)}
                    >
                      Cancel
                    </a>
                    <Button onClick={lastNameHandleSubmit(onSubmitLastname)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <DetailTitle title="Phone" />
                <PlaceholderTitle
                  title={
                    !isEmpty(userProfileRedux)
                      ? userProfileRedux.phone
                      : 'Phone'
                  }
                  isEdit={editFlagObj.phone}
                  onEditClick={() => handleEditOpen('phone')}
                />

                <div
                  className={cx('edit-section', {
                    show: editFlagObj.phone,
                  })}
                >
                  <InputGroup isCustom>
                    <Controller
                      mask="+1 (999) 999-9999"
                      className="form-control"
                      placeholder={'Your phone number'}
                      as={
                        <InputMask>
                          {(maskProps) => (
                            <Input
                              {...maskProps}
                              isInvalid={
                                !isEmpty(phoneErrors) &&
                                !isEmpty(phoneErrors.phone)
                              }
                              refProps={phoneRegister}
                            />
                          )}
                        </InputMask>
                      }
                      control={phoneControl}
                      name="phone"
                    />
                    {!isEmpty(phoneErrors) && (
                      <Form.Control.Feedback type="invalid">
                        {phoneErrors.phone.message}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                  <div className="action-btn">
                    <a
                      className="cancel"
                      onClick={() => handleCancel('phone', phoneReset)}
                    >
                      Cancel
                    </a>
                    <Button onClick={phoneHandleSubmit(onSubmitPhone)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <DetailTitle title="Email" />
                <PlaceholderTitle
                  title={
                    !isEmpty(userProfileRedux)
                      ? userProfileRedux.email
                      : 'Email'
                  }
                  isEdit={editFlagObj.email}
                  isCustomFunc
                />

                <div
                  className={cx('edit-section', {
                    show: editFlagObj.email,
                  })}
                >
                  <InputGroup isCustom>
                    <Input
                      type="text"
                      placeholder={
                        !isEmpty(userProfileRedux)
                          ? userProfileRedux.email
                          : 'Email'
                      }
                      name="email"
                      refProps={emailRegister}
                      isInvalid={
                        !isEmpty(emailErrors) && !isEmpty(emailErrors.email)
                      }
                    />
                  </InputGroup>
                  <div className="action-btn">
                    <a
                      className="cancel"
                      onClick={() => handleCancel('email', emailReset)}
                    >
                      Cancel
                    </a>
                    <Button onClick={emailHandleSubmit(onSubmitEmail)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <SeperatorStyle className="separator" />
            {/* <div className="profile-sec">
              <h3 className="sub-title profile-title">Payment information</h3>
              <div className="profile-details">
                <div className="detail-title">
                  <h3 className="sub-title">Payment method</h3>
                </div>
                <div className="payment-mode">
                  <CustomDropdown
                    list={PaymentTypeList}
                    value={currentPaymentType}
                    listClassname="payby"
                    placeholder="Choose Method"
                    handleDropdownChange={handlePaymentType}
                  />
                </div>
              </div>
            </div>
            <SeperatorStyle className="separator" /> */}
            <div className="profile-sec">
              <h3 className="sub-title profile-title">Card details</h3>
              {!isEmpty(creditCards) && !addNewCardFlag
                ? creditCards.map((card) => (
                    <div className="profile-details" key={card.id}>
                      <DetailTitle title="Card" />
                      <PlaceholderTitle
                        title={`${'**** **** **** '}${card.card_last_four}`}
                        isCustomFunc
                      >
                        {!card.default_card && (
                          <li>
                            <a
                              className="edit"
                              onClick={() => handleToDefault(card)}
                            >
                              Default
                            </a>
                          </li>
                        )}
                        <li>
                          <a
                            className="delete"
                            onClick={() => handleDeleteCard(card)}
                          >
                            Delete
                          </a>
                        </li>
                      </PlaceholderTitle>
                    </div>
                  ))
                : ''}
              <div className="profile-details">
                {/* Add Card */}
                {addNewCardFlag && <DetailTitle title="Card" />}
                <div
                  className={cx('edit-section', {
                    show: addNewCardFlag,
                  })}
                >
                  <InputGroup isCustom>
                    <Controller
                      mask={'9999-9999-9999-9999'}
                      className="form-control"
                      placeholder="**** **** **** 3453"
                      as={
                        <InputMask>
                          {(maskProps) => (
                            <Input
                              {...maskProps}
                              isInvalid={
                                !isEmpty(cardErrors) &&
                                !isEmpty(cardErrors.card_name)
                              }
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
                  <InputGroup isCustom>
                    <InputGroup isCustom style={{ width: '50%' }}>
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
                    <InputGroup isCustom style={{ width: '50%' }}>
                      <Input
                        refProps={cardRegister}
                        name="card_cvv"
                        isInvalid={
                          !isEmpty(cardErrors) && !isEmpty(cardErrors.card_cvv)
                        }
                        placeholder="CVC/CVV"
                      />
                      {!isEmpty(cardErrors) && cardErrors.card_cvv && (
                        <Form.Control.Feedback type="invalid">
                          {cardErrors.card_cvv.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </InputGroup>
                  <div className="action-btn">
                    <a className="cancel" onClick={handleCardEdit}>
                      Cancel
                    </a>
                    <Button onClick={cardHandleSubmit(onSubmitCard)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
              <span
                className={cx('add-new', {
                  'd-none': addNewCardFlag,
                })}
              >
                <a onClick={handleCardEdit}>Add New</a>
              </span>
            </div>
            <SeperatorStyle className="separator" />
            <div className="profile-sec">
              <h3 className="sub-title profile-title">Notifications </h3>
              <div className="profile-details notification">
                <h3 className="sub-title">Mail</h3>
                <Form>
                  <Form.Check
                    type="switch"
                    id="email_confirmation"
                    label="Email for confirmation/cancellation/reschedule of appointment"
                    onChange={(e) => handleCheckChange(e)}
                    checked={NotificationData.email_confirmation ? true : false}
                  />
                  <Form.Check
                    type="switch"
                    label="Automated receipt after massage"
                    id="email_receipt"
                    onChange={(e) => handleCheckChange(e)}
                    checked={NotificationData.email_receipt ? true : false}
                  />
                  <Form.Check
                    type="switch"
                    label="Reminder an hour before massage"
                    id="email_reminder"
                    onChange={(e) => handleCheckChange(e)}
                    checked={NotificationData.email_reminder ? true : false}
                  />
                </Form>
              </div>
              <div className="profile-details notification">
                <h3 className="sub-title">Text</h3>
                <Form>
                  <Form.Check
                    type="switch"
                    label="Reminder an hour before massage"
                    id="text_reminder"
                    onChange={(e) => handleCheckChange(e)}
                    checked={NotificationData.text_reminder ? true : false}
                  />
                </Form>
              </div>
            </div>
            <SeperatorStyle className="separator" />
            <div className="profile-sec">
              <div className="d-flex">
                <h3 className="sub-title profile-title">Password change</h3>
                <a className="back-arrow ml-auto" onClick={redirectPassword}>
                  <img src="/images/right.svg" />
                </a>
              </div>
            </div>
            <SeperatorStyle className="separator" />
            {/* <div className="profile-sec">
              <h3 className="sub-title profile-title">Direct Billing</h3>
              <div className="profile-details">
                <div className="detail-title">
                  <h3 className="sub-title">Primary</h3>
                </div>
                <div className="profile-edit">
                  <h3 className="sub-title detail">Name Surname</h3>
                  <p>11/11/1988 plan number Company name</p>
                  <ul className="list-unstyled">
                    <li>
                      <a className="delete" href="">
                        Delete
                      </a>
                    </li>
                    <li>
                      <a className="edit" href="">
                        Edit
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="edit-section">
                  <div className="input-group">
                    <textarea
                      placeholder="Enter Address"
                      className="form-control"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="action-btn">
                    <a className="cancel" href="">
                      Cancel
                    </a>
                    <button className="btn">Save</button>
                  </div>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-title">
                  <h3 className="sub-title">Secondary</h3>
                </div>
                <div className="profile-edit">
                  <p>-</p>
                  <ul className="list-unstyled">
                    <li>
                      <a className="add" href="">
                        Add
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="edit-section">
                  <div className="input-group">
                    <textarea className="form-control" rows="4"></textarea>
                  </div>
                  <div className="action-btn">
                    <a className="cancel" href="">
                      Cancel
                    </a>
                    <button className="btn">Save</button>
                  </div>
                </div>
              </div>
            </div>
           */}
          </div>
        </Container>
      </ProfileStyleWrapper>
      {/* Footer Section */}
      <Footer />
    </PageLoader>
  );
}

export default Profile;

const PaymentTypeList = [
  {
    id: 1,
    value: 'Card',
  },
  {
    id: 2,
    value: 'Pay by cash',
  },
  {
    id: 3,
    value: 'Direct billing',
  },
];
