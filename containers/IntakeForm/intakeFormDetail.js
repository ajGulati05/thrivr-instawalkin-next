import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import cx from 'classnames';
import qs from 'qs';
import Datepicker from 'components/Base/Datepicker';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import InputGroup from 'components/Base/InputGroup';
import Input from 'components/Base/Input';
import Footer from 'components/Footer';
import Form from 'react-bootstrap/Form';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { medical_conditions_list } from './constant';
import Button from 'components/Base/Button';
import Header from 'components/Header';
import { IntakeFormStyleWrapper } from './intakeForm.style';
import { phoneRegex } from 'util/config';
import InputMask from 'react-input-mask';
import { useRouter } from 'next/router';
import {
  createIntakeFormAuth,
  clearIntakeFormData,
  getIntakeFormsDetail,
  createIntakeFormNoAuth,
  getIntakeFormsDetailNoAuth,
} from 'redux/app/actions';
import { LayoutDiv } from 'components/StyleComponent';

const initialHealthMedicalCondition = {};
medical_conditions_list.map((element) => {
  initialHealthMedicalCondition[element.value] = false;
});

export default function IntakeForm() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  // const errorBackend = useSelector((state) => state.auth.error);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const intakeFormDetail = useSelector((state) => state.app.intakeFormDetail);

  const dispatch = useDispatch();
  // const [redirectFrom, setRedirectFrom] = useState('/');
  const router = useRouter();

  const [personalInfo, setPersonalInfo] = useState({
    birthdate: '',
    name: '',
    phone: '',
    address: '',
  });

  const [healthInfo, setHealthInfo] = useState({
    referred_by: '',
    physician_name: '',
    allergies: '',
    current_medications: '',
    surgery_reason: '',
    fractures_reason: '',
    illness_reason: '',
    ...initialHealthMedicalCondition,
    medical_other_bool: false,
    care_other_bool: false,
    other_bool: false,
  });
  const [pageKey, setPageKey] = useState(1);
  const [acceptCheck, setAcceptCheck] = useState(false);

  //   Mount
  useEffect(() => {
    personalInfoInitialData();
    if (router.query && router.query.form !== 'new') {
      if (router.query?.auth !== 'false') {
        dispatch(getIntakeFormsDetail({ id: router.query.form }));
      } else {
        if (router.query?.type !== 'new') {
          let data = JSON.parse(
            sessionStorage.getItem(router?.query?.booking)
              ? sessionStorage.getItem(router?.query?.booking)
              : '{}'
          );
          dispatch(getIntakeFormsDetailNoAuth(data));
        }
      }
    }

    return () => {
      dispatch(clearIntakeFormData());
    };
  }, []);

  useEffect(() => {
    personalInfoInitialData();
  }, [userProfile]);

  useEffect(() => {
    if (!isEmpty(intakeFormDetail)) {
      setPersonalInfo({
        birthdate: intakeFormDetail.birthdate
          ? new Date(intakeFormDetail.birthdate)
          : '',
        name: intakeFormDetail.name,
        phone: intakeFormDetail.phone,
        address: intakeFormDetail.address,
      });

      const medicalData = intakeFormDetail?.medical_conditions?.[0]
        ? JSON.parse(intakeFormDetail.medical_conditions[0])
        : null;
      medicalData &&
        Object.keys(initialHealthMedicalCondition).map((key) => {
          initialHealthMedicalCondition[key] = medicalData[key];
        });

      setHealthInfo({
        referred_by: intakeFormDetail?.referred_by,
        physician_name: intakeFormDetail?.physician_name,
        allergies: intakeFormDetail?.allergies,
        current_medications: intakeFormDetail?.current_medications,
        sports_activities: intakeFormDetail?.sports_activities,
        surgery:
          intakeFormDetail?.surgery &&
          JSON.parse(intakeFormDetail.surgery[0]).surgery.toString(),
        surgery_reason:
          intakeFormDetail?.surgery &&
          JSON.parse(intakeFormDetail.surgery[0]).surgery &&
          JSON.parse(intakeFormDetail.surgery[0]).surgery_reason
            ? JSON.parse(intakeFormDetail.surgery[0]).surgery_reason
            : null,
        fractures:
          intakeFormDetail?.fractures &&
          JSON.parse(intakeFormDetail.fractures[0]).fractures.toString(),
        fractures_reason:
          intakeFormDetail?.fractures &&
          JSON.parse(intakeFormDetail.fractures[0]).fractures &&
          JSON.parse(intakeFormDetail.fractures[0]).fractures_reason,
        illnesses_reason: JSON.parse(intakeFormDetail.surgery[0]).surgery_reason
          ? JSON.parse(intakeFormDetail.surgery[0]).surgery_reason
          : null,
        fractures:
          intakeFormDetail?.fractures &&
          JSON.parse(intakeFormDetail.fractures[0]).fractures.toString(),
        fractures_reason:
          intakeFormDetail?.fractures &&
          JSON.parse(intakeFormDetail.fractures[0]).fractures &&
          JSON.parse(intakeFormDetail.fractures[0]).fractures_reason
            ? JSON.parse(intakeFormDetail.fractures[0]).fractures_reason
            : null,
        illness:
          intakeFormDetail?.illness &&
          JSON.parse(intakeFormDetail.illness[0]).illness.toString(),
        illness_reason:
          intakeFormDetail?.illness &&
          JSON.parse(intakeFormDetail.illness[0]).illness &&
          JSON.parse(intakeFormDetail.illness[0]).illness_reason
            ? JSON.parse(intakeFormDetail.illness[0]).illness_reason
            : null,
        ...initialHealthMedicalCondition,
        physiotherapist:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.physiotherapist,
        chiropractor:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.chiropractor,
        massage_therapist:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.massage_therapist,
        naturopath:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.naturopath,
        care_reason:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.care_reason,
        number_treatments:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.number_treatments,
        physical:
          intakeFormDetail?.tests &&
          JSON.parse(intakeFormDetail.tests[0])?.physical,
        'x-ray':
          intakeFormDetail?.tests &&
          JSON.parse(intakeFormDetail.tests[0])?.['x-ray'],
        relieves: intakeFormDetail?.relieves
          ? JSON.parse(intakeFormDetail.relieves)[0]
          : '',
        aggravates: intakeFormDetail?.aggravates
          ? JSON.parse(intakeFormDetail.aggravates)[0]
          : '',
        motor_workplace:
          intakeFormDetail?.motor_workplace &&
          JSON.parse(
            intakeFormDetail.motor_workplace[0]
          ).motor_workplace.toString(),
        motor_workplace_reason:
          intakeFormDetail?.motor_workplace &&
          JSON.parse(intakeFormDetail.motor_workplace[0])
            ?.motor_workplace_reason
            ? JSON.parse(intakeFormDetail.motor_workplace[0])
                ?.motor_workplace_reason
            : null,
        medical_other_bool:
          intakeFormDetail?.medical_conditions &&
          JSON.parse(intakeFormDetail.medical_conditions[0]).medical_other
            ? true
            : false,
        medical_other:
          intakeFormDetail?.medical_conditions &&
          JSON.parse(intakeFormDetail.medical_conditions[0]).medical_other,
        care_other_bool:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0]).care_other
            ? true
            : false,
        care_other:
          intakeFormDetail?.care &&
          JSON.parse(intakeFormDetail.care[0])?.care_other,
        other_bool:
          intakeFormDetail?.tests && JSON.parse(intakeFormDetail.tests[0]).other
            ? true
            : false,
        other:
          intakeFormDetail?.tests &&
          JSON.parse(intakeFormDetail.tests[0]).other,
      });
    }
  }, [intakeFormDetail]);

  const personalInfoInitialData = () => {
    if (!isEmpty(userProfile)) {
      if (userProfile.firstname && userProfile.lastname) {
        const name = `${userProfile.firstname}${' '}${userProfile.lastname}`;
      }
    }
  };

  const changePageKey = (key) => {
    setPageKey(key);
  };

  const handleAcceptChange = () => {
    setAcceptCheck(!acceptCheck);
  };

  const onPersonalSubmit = async (data) => {
    setPersonalInfo(data);
    changePageKey(2);
  };

  const onHeathSubmit = async (data) => {
    setHealthInfo(data);
    changePageKey(3);
  };

  const handleSubmit = async () => {
    const medical_conditions = { ...initialHealthMedicalCondition };
    Object.keys(initialHealthMedicalCondition).map((key) => {
      medical_conditions[key] = healthInfo[key];
    });
    if (medical_conditions['medical_other_bool'])
      medical_conditions['medical_other'] = healthInfo.medical_other;
    delete medical_conditions['medical_other_bool'];
    const care = {
      physiotherapist: healthInfo.physiotherapist,
      chiropractor: healthInfo.chiropractor,
      massage_therapist: healthInfo.massage_therapist,
      naturopath: healthInfo.naturopath,
      care_other_bool: healthInfo.care_other_bool,
      care_reason: healthInfo.care_reason,
      care_other: healthInfo.care_other,
      number_treatments: healthInfo.number_treatments,
    };
    if (care['care_other_bool']) care['care_other'] = healthInfo.care_other;
    delete care['care_other_bool'];

    /* Radio Section */
    const surgery = {
      surgery: healthInfo.surgery === 'true' ? true : false,
    };

    if (healthInfo.surgery === 'true')
      surgery['surgery_reason'] = healthInfo.surgery_reason;

    const fractures = {
      fractures: healthInfo.fractures === 'true' ? true : false,
    };

    if (healthInfo.fractures === 'true')
      fractures['fractures_reason'] = healthInfo.fractures_reason;

    const illness = {
      illness: healthInfo.illness === 'true' ? true : false,
    };

    if (healthInfo.illness === 'true')
      illness['illness_reason'] = healthInfo.illness_reason;

    const motor_workplace = {
      motor_workplace: healthInfo.motor_workplace === 'true' ? true : false,
    };

    if (healthInfo.motor_workplace === 'true')
      motor_workplace['motor_workplace_reason'] =
        healthInfo.motor_workplace_reason;

    const tests = {
      physical: healthInfo.physical,
      'x-ray': healthInfo['x-ray'],
    };
    if (healthInfo.other_bool) tests['other'] = healthInfo.other;
    let payload = {
      name: personalInfo.name,
      address: personalInfo.address,
      phone: personalInfo.phone,
      birthdate: new Date(personalInfo.birthdate).toISOString(),
      medical_conditions: medical_conditions,
      care: care,
      surgery: surgery,
      fractures: fractures,
      illness: illness,
      motor_workplace: motor_workplace,
      tests: tests,
    };
    if (healthInfo.referred_by) payload['referred_by'] = healthInfo.referred_by;
    if (healthInfo.physician_name)
      payload['physician_name'] = healthInfo.physician_name;
    if (healthInfo.allergies) payload['allergies'] = healthInfo.allergies;
    if (healthInfo.current_medications)
      payload['current_medications'] = healthInfo.current_medications;
    if (healthInfo.relieves) payload['relieves'] = healthInfo.relieves;
    if (healthInfo.aggravates) payload['aggravates'] = healthInfo.aggravates;
    if (healthInfo.sports_activities)
      payload['sports_activities'] = healthInfo.sports_activities;

    if (router?.query?.intake) {
      payload['url'] = router.query.intake;
      const { status } = await dispatch(createIntakeFormNoAuth(payload));

      if (status) {
        sessionStorage.clear();

        router.push({
          pathname: `/consent-form`,
          query: {
            covid: router.query.covid,
            booking: router?.query?.booking,
            book_data: router?.query?.book_data,
          },
        });
      }
    } else {
      const { status } = await dispatch(createIntakeFormAuth(payload));
      if (status)
        router.push({
          pathname: `/intake-form`,
        });
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <>
            <title>Intake Form - Thrivr</title>
          </>
        </Head>

        {/* Header Section */}
        <Header className="header-white" />
        <LayoutDiv>
          <IntakeFormStyleWrapper>
            <Container>
              <div className="form-wrapper position-relative">
                {pageKey == 1 && (
                  <PersonalInfoForm
                    personalInfo={personalInfo}
                    onPersonalSubmit={onPersonalSubmit}
                  />
                )}
                {pageKey == 2 && (
                  <HealthInfoForm
                    setPageKey={(data) => setPageKey(data)}
                    onHeathSubmit={onHeathSubmit}
                    healthInfo={healthInfo}
                    intakeFormDetail={intakeFormDetail}
                  />
                )}
                {pageKey == 3 && (
                  <>
                    <div className="acknowledge-nav-arrow">
                      <button
                        className={`back-arrow-left arrow-nav ${cx({
                          hide: false,
                        })}`}
                        onClick={() => setPageKey(2)}
                      >
                        <img src="/images/left.svg" />
                      </button>
                    </div>
                    <div className="intake-nav d-flex mb-4">
                      <h3 className="sub-title active">
                        Acknowledge confirmation
                      </h3>
                    </div>
                    <div>
                      <p>
                        I understand that the massage therapist is providing
                        massage therapy services within their scope of practice
                        as defined by the Massage Therapist Association of
                        Saskatchewan, Inc.
                      </p>
                      <p>
                        I hereby consent for my therapist to treat me with
                        massage therapy for the above noted purposes including
                        such assessments, examinations and techniques, which may
                        be recommended, by my therapist.
                      </p>
                      <p>
                        I acknowledge that the therapist is not a physician and
                        does not diagnose illness or disease or any other
                        physical or mental disorder. I clearly understand that
                        massage therapy is not a substitute for a medical
                        examination. It is recommended that I attend my personal
                        physician for any ailments that I may be experiencing. I
                        acknowledge that no assurance or guarantee has been
                        provided to me as to the results of the treatment. I
                        acknowledge that with any treatment there can be risks
                        and those risks have been explained to me and I assume
                        those risks.
                      </p>
                      <p>
                        I acknowledge and understand that the therapist must be
                        fully aware of my existing medical conditions. I have
                        completed my medical history form as provided by my
                        therapist and disclosed to the therapist all of those
                        medical conditions affecting me. It is my responsibility
                        to keep the massage therapist updated on my medical
                        history. The information I have provided is true and
                        complete to the best of my knowledge.
                      </p>
                      <p>
                        I authorize my therapist to release or obtain
                        information pertaining to my condition(s) and/or
                        treatment to/from my other caregivers or third party
                        payers.
                      </p>
                      <p>
                        I have read the above noted consent and I have had the
                        opportunity to question the contents and my therapy. By
                        signing this form, I confirm my consent to treatment and
                        intend this consent to cover the treatment discussed
                        with me and such additional treatment as proposed by my
                        therapist from time to time, to deal with my physical
                        condition and for which I have sought treatment. I
                        understand that at any time I may withdraw my consent
                        and treatment will be stopped.
                      </p>
                      <div className="form-row">
                        <Form.Check
                          custom
                          type="checkbox"
                          name="accept"
                          id="accept"
                          label="I understand and accept the above."
                          onChange={handleAcceptChange}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <Button
                          className={`${'mob-full'}${
                            acceptCheck ? '' : ' disabled'
                          }`}
                          onClick={handleSubmit}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Container>
          </IntakeFormStyleWrapper>
        </LayoutDiv>

        {/* Footer Section */}
        <Footer />
      </div>
    </PageLoader>
  );
}

const PersonalInfoForm = ({ personalInfo, onPersonalSubmit }) => {
  const personalInfotFormRef = React.useRef(null);

  const PersonalFormschema = yup.object({
    name: yup.string().required(),
    birthdate: yup.string().required().nullable(),
    phone: yup
      .string()
      .required()
      .matches(phoneRegex, 'Please enter valid phone number'),
    address: yup.string().required(),
  });

  const {
    register: personalformRegister,
    handleSubmit: personalhandleSubmit,
    errors: personalformErrors,
    control: personalformControl,
    setValue,
  } = useForm({
    validationSchema: PersonalFormschema,
  });

  useEffect(() => {
    if (!isEmpty(personalInfo)) {
      if (personalInfo.birthdate) {
        setValue('birthdate', new Date(personalInfo.birthdate));
      }
      if (personalInfo.phone) {
        setValue('phone', personalInfo.phone);
      }
      if (personalInfo.name) {
        setValue('name', personalInfo.name);
      }
      if (personalInfo.address) {
        setValue('address', personalInfo.address);
      }
    }
  }, [personalInfo]);

  return (
    <>
      <div className="nav-arrow-right">
        <button
          form="intake-personal-form"
          className={`back-arrow-right arrow-nav`}
          type="submit"
        >
          <img src="/images/right.svg" />
        </button>
      </div>
      <div className="intake-nav d-flex mb-4">
        <h3 className="sub-title active">Personal details</h3>
        <h3 className="sub-title ml-auto">Health history</h3>
        <h3 className="sub-title ml-auto">Acknowledge confirmation</h3>
      </div>

      <Form
        id="intake-personal-form"
        className="intake-form"
        onSubmit={personalhandleSubmit(onPersonalSubmit)}
      >
        <div className="form-row">
          <div className="form-group col-md-6 pr-md-4">
            <label> Full name</label>
            <Input
              type="text"
              name="name"
              title="Full name"
              placeholder="Full name"
              refProps={personalformRegister}
              isInvalid={
                !isEmpty(personalformErrors) &&
                !isEmpty(personalformErrors.name)
                  ? true
                  : false
              }
            />
            {!isEmpty(personalformErrors) && personalformErrors.name && (
              <Form.Control.Feedback type="invalid">
                {personalformErrors.name.message}
              </Form.Control.Feedback>
            )}
          </div>
          <div className="form-group col-md-6 pl-md-4">
            <label> Birth date</label>
            <div className="calender-dropdown">
              <InputGroup isCustom className="date-alt mob-half d-inline-block">
                <Controller
                  control={personalformControl}
                  name="birthdate"
                  onChangeName={'handleDateChange'}
                  page="intake"
                  as={
                    <Datepicker
                      dateClassName="form-control profile-title"
                      pastDateDisable={false}
                      isInvalid={
                        !isEmpty(personalformErrors) &&
                        !isEmpty(personalformErrors.birthdate)
                      }
                    />
                  }
                />
              </InputGroup>
            </div>
            {!isEmpty(personalformErrors) && personalformErrors.birthdate && (
              <div className="invalid">
                {personalformErrors.birthdate.message}
              </div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6 pr-md-4">
            <label> Phone number</label>
            <Controller
              mask="+1 (999) 999-9999"
              className="form-control"
              placeholder="Your phone number"
              as={
                <InputMask>
                  {(maskProps) => (
                    <Input
                      {...maskProps}
                      refProps={personalformRegister}
                      isInvalid={
                        !isEmpty(personalformErrors) &&
                        !isEmpty(personalformErrors.phone)
                      }
                    />
                  )}
                </InputMask>
              }
              control={personalformControl}
              name="phone"
            />
            {!isEmpty(personalformErrors) && personalformErrors.phone && (
              <Form.Control.Feedback type="invalid">
                {personalformErrors.phone.message}
              </Form.Control.Feedback>
            )}
          </div>
          <div className="form-group col-md-6 pl-md-4">
            <label> Address</label>
            <Input
              type="text"
              name="address"
              title="Address"
              placeholder="Address"
              refProps={personalformRegister}
              isInvalid={
                !isEmpty(personalformErrors) &&
                !isEmpty(personalformErrors.address)
                  ? true
                  : false
              }
            />
            {!isEmpty(personalformErrors) && personalformErrors.address && (
              <Form.Control.Feedback type="invalid">
                {personalformErrors.address.message}
              </Form.Control.Feedback>
            )}
          </div>
        </div>

        <div className="text-center mt-2">
          <Button
            type="submit"
            className={`mob-full`}
            ref={personalInfotFormRef}
          >
            Next
          </Button>
        </div>
      </Form>
    </>
  );
};
PersonalInfoForm.propTypes = {
  personalInfo: PropTypes.object,
  onPersonalSubmit: PropTypes.func,
  personalSetValues: PropTypes.func,
  personalErrors: PropTypes.any,
  setPersonalInfotFormRef: PropTypes.func,
};

const HealthInfoForm = ({
  healthInfo,
  onHeathSubmit,
  setPageKey,
  intakeFormDetail,
}) => {
  const HealthFormschema = yup.object({
    referred_by: yup.string(),
    physician_name: yup.string().optional(),
    allergies: yup.string().optional(),
    current_medications: yup.string().optional(),
    surgery: yup.string().optional(),
    fractures: yup.string().optional(),
    illness: yup.string().optional(),
    motor_workplace: yup.string().optional(),
    surgery_reason: yup.string().when('surgery', {
      is: 'true',
      then: yup.string().required('This field is required'),
    }),
    fractures_reason: yup.string().when('fractures', {
      is: 'true',
      then: yup.string().required('This field is required'),
    }),
    illness_reason: yup.string().when('illness', {
      is: 'true',
      then: yup.string().required('This field is required'),
    }),
    motor_workplace_reason: yup.string().when('motor_workplace', {
      is: 'true',
      then: yup.string().required('This field is required'),
    }),
    care_other_bool: yup.bool().optional(),
    care_other: yup.string().when('care_other_bool', {
      is: true,
      then: yup.string().required('This field is required'),
    }),
    other_bool: yup.bool().optional(),
    other: yup.string().when('other_bool', {
      is: true,
      then: yup.string().required('This field is required'),
    }),
    medical_other_bool: yup.bool().optional(),
    medical_other: yup.string().when('medical_other_bool', {
      is: true,
      then: yup.string().required('This field is required'),
    }),
  });

  const {
    register: healthformRegister,
    handleSubmit: healthhandleSubmit,
    errors: healthformErrors,
    watch: healthformWatch,
  } = useForm({
    validationSchema: HealthFormschema,
    defaultValues: {
      ...healthInfo,
    },
  });

  const watchMedicalOther = healthformWatch('medical_other_bool');
  const watchCareOther = healthformWatch('care_other_bool');
  const watchSurgeryOther = healthformWatch('surgery');
  const watchFracturesOther = healthformWatch('fractures');
  const watchIllnessOther = healthformWatch('illness');
  const watchMotorworkplaceOther = healthformWatch('motor_workplace');
  const watchOtherTest = healthformWatch('other_bool');

  return (
    <>
      <div className="navigation-arrow">
        <button
          className={`back-arrow-left arrow-nav ${cx({
            hide: false,
          })}`}
          onClick={() => setPageKey(1)}
        >
          <img src="/images/left.svg" />
        </button>

        <button
          form="intake-health-form"
          className={`back-arrow-right arrow-nav`}
          type="submit"
        >
          <img src="/images/right.svg" />
        </button>
      </div>
      <div className="intake-nav d-flex mb-4">
        <h3 className="sub-title active">Health history</h3>
        <h3 className="sub-title ml-auto">Acknowledge confirmation</h3>
      </div>
      <Form
        className="intake-form-healthy"
        id="intake-health-form"
        onSubmit={healthhandleSubmit(onHeathSubmit)}
      >
        <div className="form-row">
          <div className="col-sm-6 col-6">
            <label>Referred by</label>
            <InputGroup isCustom>
              <Input
                type="text"
                name="referred_by"
                placeholder="Referred by"
                refProps={healthformRegister}
                isInvalid={
                  !isEmpty(healthformErrors) &&
                  !isEmpty(healthformErrors.referred_by)
                    ? true
                    : false
                }
              />
              {!isEmpty(healthformErrors) && healthformErrors.referred_by && (
                <Form.Control.Feedback type="invalid">
                  {healthformErrors.referred_by.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </div>
          <div className="col-sm-6 col-6">
            <label>Physician name</label>
            <InputGroup isCustom>
              <Input
                type="text"
                name="physician_name"
                placeholder="Physician name"
                refProps={healthformRegister}
              />
            </InputGroup>
          </div>
        </div>
        <div className="form-row">
          <label>Sports and activities</label>
          <InputGroup isCustom>
            <Input
              type="text"
              name="sports_activities"
              placeholder="Sports and activities"
              refProps={healthformRegister}
            />
          </InputGroup>
        </div>
        <div className="form-row">
          <label>Allergies</label>
          <InputGroup isCustom>
            <Input
              type="text"
              name="allergies"
              placeholder="Allergies"
              refProps={healthformRegister}
            />
          </InputGroup>
        </div>
        <div className="form-row">
          <label>Current medications</label>
          <InputGroup isCustom>
            <Input
              type="text"
              name="current_medications"
              placeholder="Current medications"
              refProps={healthformRegister}
            />
          </InputGroup>
        </div>
        <div>
          <label>Are you under medical care for any of the following</label>
          <div className="form-row" style={{ marginTop: '0' }}>
            {medical_conditions_list.map((data, index) => (
              <div className="col-sm-4 col-6 mb-2" key={index}>
                <Form.Check
                  custom
                  type="checkbox"
                  name={data.value}
                  id={data.value}
                  label={data.label}
                  ref={healthformRegister}
                />
              </div>
            ))}
            {watchMedicalOther && (
              <div className="form-row w-100">
                <label>Details?</label>
                <InputGroup isCustom>
                  <Input
                    type="text"
                    name="medical_other"
                    placeholder="Other Medical Conditions"
                    refProps={healthformRegister}
                    isInvalid={
                      !isEmpty(healthformErrors) &&
                      !isEmpty(healthformErrors.medical_other)
                        ? true
                        : false
                    }
                  />
                  {!isEmpty(healthformErrors) &&
                    healthformErrors.medical_other && (
                      <Form.Control.Feedback type="invalid">
                        {healthformErrors.medical_other.message}
                      </Form.Control.Feedback>
                    )}
                </InputGroup>
              </div>
            )}
          </div>
        </div>
        <div>
          <label>Have you received care from any of the following</label>
          <div className="form-row" style={{ marginTop: '0' }}>
            <div className="col-sm-4 col-6 mb-2">
              <Form.Check
                custom
                type="checkbox"
                name="physiotherapist"
                id="physiotherapist"
                label="Physiotherapist"
                ref={healthformRegister}
              />
            </div>
            <div className="col-sm-4 col-6 mb-2">
              <Form.Check
                custom
                type="checkbox"
                name="massage_therapist"
                id="Massage therapist"
                label="Massage therapist"
                ref={healthformRegister}
              />
            </div>
            <div className="col-sm-4 col-6 mb-2">
              <Form.Check
                custom
                type="checkbox"
                name="chiropractor"
                id="chiropractor"
                label="Chiropractor"
                ref={healthformRegister}
              />
            </div>
            <div className="col-sm-4 col-6 mb-2">
              <Form.Check
                custom
                type="checkbox"
                name="naturopath"
                id="naturopath"
                label="Naturopath"
                ref={healthformRegister}
              />
            </div>
            <div className="col-sm-4 col-6 mb-2">
              <Form.Check
                custom
                type="checkbox"
                name="care_other_bool"
                id="other"
                label="Other"
                ref={healthformRegister}
              />
            </div>
            {watchCareOther && (
              <div className="col-sm-12 col-12">
                <label>Details?</label>
                <Input
                  type="text"
                  name="care_other"
                  placeholder="Why ?"
                  refProps={healthformRegister}
                  isInvalid={
                    !isEmpty(healthformErrors) &&
                    !isEmpty(healthformErrors.care_other)
                      ? true
                      : false
                  }
                />
                {!isEmpty(healthformErrors) && healthformErrors.care_other && (
                  <Form.Control.Feedback type="invalid">
                    {healthformErrors.care_other.message}
                  </Form.Control.Feedback>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="form-row">
          <label>Reason for treatment</label>
          <InputGroup isCustom>
            <Input
              type="text"
              name="care_reason"
              placeholder="Reason for treatment"
              refProps={healthformRegister}
            />
          </InputGroup>
        </div>
        <div className="form-row">
          <label>Number/duration of treatments</label>
          <InputGroup isCustom>
            <Input
              type="text"
              name="number_treatments"
              placeholder="Number/duration of treatments"
              refProps={healthformRegister}
            />
          </InputGroup>
        </div>

        <div>
          <label>Have you had surgery in the past?</label>
          <Form.Check
            custom
            type="radio"
            name="surgery"
            id="surgery_no"
            label="No"
            value={false}
            ref={healthformRegister}
          />

          <Form.Check
            custom
            type="radio"
            name="surgery"
            id="surgery_yes"
            label="Yes"
            value={true}
            ref={healthformRegister}
          />
          {watchSurgeryOther === 'true' && (
            <div className="form-row">
              <label>Details?</label>
              <InputGroup isCustom>
                <Input
                  type="text"
                  name="surgery_reason"
                  placeholder="Details ?"
                  refProps={healthformRegister}
                  isInvalid={
                    !isEmpty(healthformErrors) &&
                    !isEmpty(healthformErrors.surgery_reason)
                      ? true
                      : false
                  }
                />
                {!isEmpty(healthformErrors) &&
                  healthformErrors.surgery_reason && (
                    <Form.Control.Feedback type="invalid">
                      {healthformErrors.surgery_reason.message}
                    </Form.Control.Feedback>
                  )}
              </InputGroup>
            </div>
          )}
        </div>
        <div>
          <label>Have you had any fractures/sprains in the past?</label>
          <Form.Check
            custom
            type="radio"
            name="fractures"
            id="fractures_no"
            label="No"
            value={false}
            ref={healthformRegister}
          />
          <Form.Check
            custom
            type="radio"
            name="fractures"
            id="fractures_yes"
            label="Yes"
            value={true}
            ref={healthformRegister}
          />
          {watchFracturesOther === 'true' && (
            <div className="form-row">
              <label>Details?</label>
              <InputGroup isCustom>
                <Input
                  type="text"
                  name="fractures_reason"
                  placeholder="Details ?"
                  refProps={healthformRegister}
                  isInvalid={
                    !isEmpty(healthformErrors) &&
                    !isEmpty(healthformErrors.fractures_reason)
                      ? true
                      : false
                  }
                />
                {!isEmpty(healthformErrors) &&
                  healthformErrors.fractures_reason && (
                    <Form.Control.Feedback type="invalid">
                      {healthformErrors.fractures_reason.message}
                    </Form.Control.Feedback>
                  )}
              </InputGroup>
            </div>
          )}
        </div>
        <div>
          <label>Have you had any serious illnesses in the past?</label>
          <Form.Check
            custom
            type="radio"
            name="illness"
            id="illnesses_no"
            label="No"
            value={false}
            ref={healthformRegister}
          />
          <Form.Check
            custom
            type="radio"
            name="illness"
            id="illnesses_yes"
            label="Yes"
            value={true}
            ref={healthformRegister}
          />
          {watchIllnessOther === 'true' && (
            <div className="form-row">
              <label>Details?</label>
              <InputGroup isCustom>
                <Input
                  type="text"
                  name="illness_reason"
                  placeholder="Details ?"
                  refProps={healthformRegister}
                  isInvalid={
                    !isEmpty(healthformErrors) &&
                    !isEmpty(healthformErrors.illness_reason)
                      ? true
                      : false
                  }
                />
                {!isEmpty(healthformErrors) &&
                  healthformErrors.illness_reason && (
                    <Form.Control.Feedback type="invalid">
                      {healthformErrors.illness_reason.message}
                    </Form.Control.Feedback>
                  )}
              </InputGroup>
            </div>
          )}
        </div>
        <div>
          <label>
            Did the current injury result from a motor vehicle accident or
            workplace injury?
          </label>
          <Form.Check
            custom
            type="radio"
            name="motor_workplace"
            id="motor_workplace_no"
            label="No"
            value={false}
            ref={healthformRegister}
          />
          <Form.Check
            custom
            type="radio"
            name="motor_workplace"
            id="motor_workplace_yes"
            label="Yes"
            value={true}
            ref={healthformRegister}
          />
          {watchMotorworkplaceOther === 'true' && (
            <div className="form-row">
              <label>Details?</label>
              <InputGroup isCustom>
                <Input
                  type="text"
                  name="motor_workplace_reason"
                  placeholder="Details ?"
                  refProps={healthformRegister}
                  isInvalid={
                    !isEmpty(healthformErrors) &&
                    !isEmpty(healthformErrors.motor_workplace_reason)
                      ? true
                      : false
                  }
                />
                {!isEmpty(healthformErrors) &&
                  healthformErrors.motor_workplace_reason && (
                    <Form.Control.Feedback type="invalid">
                      {healthformErrors.motor_workplace_reason.message}
                    </Form.Control.Feedback>
                  )}
              </InputGroup>
            </div>
          )}
        </div>
        <div>
          <label>
            Have you had any of the following regarding your current condition
          </label>
          <div className="form-row" style={{ marginTop: '0' }}>
            <div className="col-sm-4 col-6">
              <Form.Check
                custom
                type="checkbox"
                name="physical"
                id="physician_examination"
                label="Physician's examination"
                ref={healthformRegister}
              />
            </div>
            <div className="col-sm-4 col-6">
              <Form.Check
                custom
                type="checkbox"
                name="x-ray"
                id="x-ray"
                label="X-ray"
                ref={healthformRegister}
              />
            </div>
            <div className="col-sm-4 col-6">
              <Form.Check
                custom
                type="checkbox"
                name="other_bool"
                id="other_diagnostic_test"
                label="Other diagnostic test"
                ref={healthformRegister}
              />
            </div>
            {watchOtherTest && (
              <div className="form-row w-100">
                <label>Details?</label>
                <InputGroup isCustom>
                  <Input
                    type="text"
                    name="other"
                    placeholder="Details ?"
                    refProps={healthformRegister}
                    isInvalid={
                      !isEmpty(healthformErrors) &&
                      !isEmpty(healthformErrors.other)
                        ? true
                        : false
                    }
                  />
                  {!isEmpty(healthformErrors) && healthformErrors.other && (
                    <Form.Control.Feedback type="invalid">
                      {healthformErrors.other.message}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </div>
            )}
          </div>
          <div className="form-row">
            <label>What relieves your pain?</label>
            <InputGroup isCustom>
              <Input
                type="text"
                name="relieves"
                placeholder="What relieves your pain"
                refProps={healthformRegister}
              />
            </InputGroup>
          </div>
          <div className="form-row">
            <label>What aggravates your pain?</label>
            <InputGroup isCustom>
              <Input
                type="text"
                name="aggravates"
                placeholder="What aggravates your pain"
                refProps={healthformRegister}
              />
            </InputGroup>
          </div>
        </div>
        <div className="text-center mt-2">
          <Button className={`${'mob-full'}`} type="submit">
            Next
          </Button>
        </div>
      </Form>
    </>
  );
};

HealthInfoForm.propTypes = {
  healthInfo: PropTypes.object,
  onHeathSubmit: PropTypes.func,
  setPageKey: PropTypes.func,
};
