import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { ConsentFormStyleWrapper } from './consentForm.style';
import * as yup from 'yup';
import {
  createCovidFormAuth,
  getCovidFormsDetail,
  consentCovidForm,
} from 'redux/app/actions';
import CustomModal from 'components/Base/Modal';

const Schema = yup.object().shape({
  precautions: yup.string().optional(),
  status: yup.bool().optional(),
  when: yup.string().when('status', {
    is: true,
    then: yup.string().required('This field is required'),
  }),
  antibody: yup.bool().optional(),
  results: yup.string().when('antibody', {
    is: true,
    then: yup.string().required('This field is required'),
  }),
  contact: yup.bool().optional(),
});

const WaiverSchema = yup.object().shape({
  name: yup.string().required(),
  therapistn: yup.string().required(),
  acknowledge: yup.bool().oneOf([true], 'Field must be checked'),
});

export default function ConsentForm() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const covidFormDetail = useSelector((state) => state.app.covidFormDetail);

  const [pageKey, setPageKey] = useState('prev');
  const [formInfo, setFormInfo] = useState({
    precautions: '',
    contact: false,
    antibody: false,
    status: false,
  });
  const [modalShow, setModalShow] = useState(false);
  const [covidData, setCovidData] = useState({});
  const [waiverData, setWaiverData] = useState({
    name: '',
    therapistn: '',
    acknowledge: false,
  });
  const [firstStepData, setFirstStepData] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue: setFormValue,
  } = useForm({
    validationSchema: Schema,
    defaultValues: {
      ...formInfo,
    },
  });

  const {
    register: waiverRegister,
    handleSubmit: handleWaiverSubmit,
    errors: waivererrors,
    setValue,
    watch: watchWaiver,
  } = useForm({
    validationSchema: WaiverSchema,
    defaultValues: {
      ...waiverData,
    },
  });

  const watchStatus = watch('status');
  const watchAntibody = watch('antibody');
  const watchAcknowledge = watchWaiver('acknowledge');

  //   Mount
  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query) && router?.query?.covid) {
      const covidParams = JSON.parse(router?.query?.covid);
      setCovidData(covidParams);
      fetchData(covidParams);
    }
    setModalShow(true);
  }, []);

  const queryParam = new URLSearchParams(router?.query?.covid);

  const fetchData = async (covidParams) => {
    if (queryParam.has('cform')) {
      await dispatch(getCovidFormsDetail(covidParams?.covid_form));
    }
  };
  useEffect(() => {
    if (!isEmpty(covidFormDetail)) {
      setFormValue(
        'status',
        covidFormDetail?.testing?.[0]
          ? JSON.parse(covidFormDetail.testing[0]).status
          : false
      );

      setFormValue(
        'antibody',
        covidFormDetail?.testing?.[0]
          ? JSON.parse(covidFormDetail.testing[0]).antibody
          : false
      );

      setFormValue(
        'fever',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).fever
          : false
      );

      setFormValue(
        'fatigue',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).fatigue
          : false
      );
      setFormValue(
        'cough',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).cough
          : false
      );
      setFormValue(
        'chills',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).chills
          : false
      );
      setFormValue(
        'sore',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).sore
          : false
      );
      setFormValue(
        'nasal',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).nasal
          : false
      );
      setFormValue(
        'shortness',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).shortness
          : false
      );
      setFormValue(
        'onset',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).onset
          : false
      );
      setFormValue(
        'loss',
        covidFormDetail?.symptoms?.[0]
          ? JSON.parse(covidFormDetail.symptoms[0]).loss
          : false
      );

      setFormValue(
        'exposure',
        covidFormDetail?.exposure
          ? JSON.parse(JSON.parse(covidFormDetail?.exposure)?.[0])
          : false
      );
      setFormValue(
        'precautions',
        covidFormDetail?.precautions
          ? JSON.parse(covidFormDetail?.precautions)?.[0]
          : ''
      );
      setFormValue(
        'air_travel',
        covidFormDetail?.travel?.[0]
          ? JSON.parse(covidFormDetail.travel[0]).air_travel
          : false
      );
      setFormValue(
        'high_infection',
        covidFormDetail?.travel?.[0]
          ? JSON.parse(covidFormDetail.travel[0]).high_infection
          : false
      );

      setFormValue(
        'contact',
        JSON.parse(JSON.parse(covidFormDetail?.contact)?.[0]) ? true : false
      );

      setFormValue(
        'willing_was',
        covidFormDetail?.actions
          ? JSON.parse(JSON.parse(covidFormDetail.actions)?.[0])?.willing_was
          : false
      );
      setFormValue(
        'willing_wear',
        covidFormDetail?.actions
          ? JSON.parse(JSON.parse(covidFormDetail.actions)?.[0])?.willing_wear
          : false
      );

      setValue(
        'name',
        covidFormDetail?.name ? JSON.parse(covidFormDetail.name)[0] : ''
      );
    }
  }, [covidFormDetail]);

  useEffect(() => {
    if (!isEmpty(covidFormDetail)) {
      if (watchStatus) {
        setFormValue(
          'when',
          covidFormDetail?.testing?.[0]
            ? JSON.parse(covidFormDetail.testing[0]).when
            : ''
        );
      }

      if (watchAntibody) {
        setFormValue(
          'results',
          covidFormDetail?.testing?.[0]
            ? JSON.parse(covidFormDetail.testing[0]).results
            : ''
        );
      }
    }
  }, [covidFormDetail, watchStatus, watchAntibody]);

  const onSubmit = async (data) => {
    setFormInfo(data);
    setPageKey('next');
    if (router.query?.book_data) {
      const bookData = JSON.parse(router.query.book_data);
      setValue('therapistn', bookData.therapist_name);
      if (!isEmpty(userProfile)) {
        setValue('name', `${userProfile.firstname} ${userProfile.lastname}`);
      }
    }
  };

  const onWaiverSubmit = async (data) => {
    data = {
      ...data,
      ...formInfo,
    };

    const symptoms = {
      fever: data.fever,
      fatigue: data.fatigue,
      cough: data.cough,
      chills: data.chills,
      sore: data.sore,
      nasal: data.nasal,
      shortness: data.shortness,
      onset: data.onset,
      loss: data.loss,
    };
    const testing = {
      status: data.status,
      antibody: data.antibody,
    };

    if (data.status) {
      testing.when = data.when;
    }

    if (data.when) {
      testing.results = data.results;
    }

    const travel = {
      air_travel: data.air_travel,
      high_infection: data.high_infection,
    };
    const actions = {
      willing_was: data.willing_was,
      willing_wear: data.willing_wear,
    };
    let payload = {
      name: data.name,
      testing: testing,
      exposure: data.exposure,
      travel: travel,
      symptoms: symptoms,
      contact: data.contact ? true : false,
      actions: actions,
      modifier: 'U',
      active: 1,
      consent: 1,
    };
    if (!isEmpty(data.precautions)) payload['precautions'] = data.precautions;
    if (!isEmpty(data.therapistn)) payload['therapistn'] = data.therapistn;

    let query = {
      url: covidData?.covidFormAPIUrl,
    };
    const { status } = await dispatch(createCovidFormAuth({ payload, query }));
    if (status) {
      if (isEmpty(userProfile)) {
        router.push('/');
        return;
      }

      router.push(
        `/order-detail/[detail]`,
        `/order-detail/${router?.query?.booking}`
      );
    }
  };

  const handleRedirectOrder = async () => {
    let payload = {
      url: covidData?.covidFormAPIUrl,
      data: {
        modifier: 'C',
      },
    };
    const { status } = await dispatch(consentCovidForm(payload));
    if (status) {
      if (isEmpty(userProfile)) {
        router.push('/');
        return;
      }
      router.push(
        `/order-detail/[detail]`,
        `/order-detail/${router?.query?.booking}`
      );
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Supplementary Consent form – COVID-19 - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="header-white" />

        {/* Banner Section */}
        <ConsentFormStyleWrapper>
          <Container>
            <CustomModal
              show={modalShow}
              onHide={() => console.log('')}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              backdrop="static"
              className="modal-cancle desktop-alt massage-confirm"
              header={
                <>
                  <h5 className="modal-title d-sm-block" id="exampleModalLabel">
                    Massage Confirmed
                  </h5>
                </>
              }
              body={
                <div className="confirm-content">
                  {covidData?.covidFormAPIUrl?.includes('cform=')
                    ? `${'Do you consent to share your covid form with '}${queryParam?.get(
                        'therapist_name'
                      )}?`
                    : 'Please fill the following covid form.'}
                </div>
              }
              footer={
                <>
                  {covidData?.covidFormAPIUrl?.includes('cform=') ? (
                    <>
                      <Button
                        className="btn d-sm-block"
                        onClick={handleRedirectOrder}
                      >
                        I consent
                      </Button>
                      <Button
                        className="btn d-sm-block"
                        onClick={() => setModalShow(false)}
                      >
                        Update
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="btn d-sm-block"
                      onClick={() => setModalShow(false)}
                    >
                      Fill Form
                    </Button>
                  )}
                </>
              }
            />
            {pageKey == 'prev' && (
              <Form
                className="request-form consent-form-main-wrapper"
                onSubmit={handleSubmit(onSubmit)}
              >
                <h4 className="consent-main-title">
                  Suplementary Consent Form - COVID-19
                </h4>
                <ul className="consent-list">
                  <li>
                    Due to the infectious nature of COVID-19, this additional
                    intake form must be completed before each massage therapy
                    session. Please know that people with COVID-19 can be
                    asymptomatic and still be contagious.
                  </li>
                  <li>
                    There is no way to completely protect ourselves from this
                    virus.
                  </li>
                  <li>
                    Ask for the checklist of precautions to see how I am
                    disinfecting my clinic between sessions.
                  </li>
                  <li>
                    Please answer these questions truthfully and do everything
                    asked so we can do our best to protect each other. Thank
                    you!
                  </li>
                </ul>
                <div className="testing">
                  <div className="form-title">1. Testing status:</div>
                  <div className="row">
                    <Form.Check
                      type="switch"
                      label="Have you been tested for COVID? "
                      name="status"
                      id="status"
                      className="col-sm-5 col-12"
                      ref={register}
                    />
                    <Form.Check
                      type="switch"
                      label="The antibody?"
                      className="col-sm-5 col-12"
                      name="antibody"
                      id="antibody"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <div className="col-sm-5 col-12 d-flex">
                      {watchStatus && (
                        <>
                          <label>When?</label>
                          <Input
                            type="text"
                            name="when"
                            className="form-control"
                            placeholder=""
                            refProps={register}
                            isInvalid={
                              !isEmpty(errors) && !isEmpty(errors.when)
                                ? true
                                : false
                            }
                          />
                        </>
                      )}
                    </div>
                    <div className="col-sm-5 col-12 d-flex">
                      {watchAntibody && (
                        <>
                          <label>What were the results?</label>
                          <Input
                            type="text"
                            name="results"
                            className="form-control"
                            placeholder=""
                            refProps={register}
                            isInvalid={
                              !isEmpty(errors) && !isEmpty(errors.results)
                                ? true
                                : false
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="symptoms">
                  <div className="form-title">
                    2. Symptoms – are you experiencing:
                  </div>
                  <div className="row">
                    <Form.Check
                      type="switch"
                      name="fever"
                      id="fever"
                      className="col-sm-5 col-12"
                      label="Fever >38C?"
                      ref={register}
                    />
                    <Form.Check
                      type="switch"
                      label="Fatigue?"
                      className="col-sm-5 col-12"
                      name="fatigue"
                      id="fatigue"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <Form.Check
                      type="switch"
                      name="cough"
                      id="cough"
                      className="col-sm-5 col-12"
                      label="Cough?"
                      ref={register}
                    />
                    <Form.Check
                      type="switch"
                      label="Chills?"
                      className="col-sm-5 col-12"
                      name="chills"
                      id="chills"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <Form.Check
                      type="switch"
                      name="sore"
                      id="sore"
                      className="col-sm-5 col-12"
                      label="Sore throat?"
                      ref={register}
                    />
                    <Form.Check
                      type="switch"
                      label="Nasal or sinus congestion?"
                      className="col-sm-5 col-12"
                      name="nasal"
                      id="nasal"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <Form.Check
                      type="switch"
                      name="shortness"
                      id="shortness"
                      className="col-sm-5 col-12"
                      label="Shortness of breath?"
                      ref={register}
                    />
                    <Form.Check
                      type="switch"
                      label="Sudden onset unexplained body aches? "
                      className="col-sm-5 col-12"
                      name="onset"
                      id="onset"
                      ref={register}
                    />
                  </div>
                  <div className="row">
                    <Form.Check
                      type="switch"
                      name="loss"
                      id="loss"
                      className="col-sm-5 col-12"
                      label="Sudden loss of taste and smell?"
                      ref={register}
                    />
                    <div className="col-sm-5 col-12"></div>
                  </div>
                </div>
                <div className="exposure">
                  <div className="form-title">3. Exposure:</div>
                  <Form.Check
                    type="switch"
                    name="exposure"
                    id="exposure"
                    label="Are you aware of having been exposed to someone with COVID-19 or anyone who has been exposed to someone with COVID-19?"
                    style={{ paddingLeft: '0' }}
                    ref={register}
                  />
                </div>
                <div className="travel">
                  <div className="form-title">4. Travel:</div>
                  <Form.Check
                    type="switch"
                    name="air_travel"
                    id="air_travel"
                    label="Have you done any air travel, domestic or international, recently?"
                    style={{ paddingLeft: '0' }}
                    ref={register}
                  />
                  <Form.Check
                    type="switch"
                    name="high_infection"
                    id="high_infection"
                    label="Have you traveled to any places with a high infection rate, where people have not been isolating (no stay at home order), or been in any groups of people where social distancing was not observed?"
                    style={{ paddingLeft: '0' }}
                    ref={register}
                  />
                </div>
                <div className="precautions">
                  <div className="form-title">5. Precautions:</div>
                  <div className="row">
                    <div className="col">
                      <label>
                        What precautions have you taken to limit your exposure
                        to the virus?
                      </label>
                      <Input
                        type="text"
                        name="precautions"
                        className="form-control"
                        placeholder=""
                        refProps={register}
                        isInvalid={
                          !isEmpty(errors) && !isEmpty(errors.precautions)
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="risk-contact">
                  <div className="form-title">6. High risk contact:</div>
                  <Form.Check
                    type="switch"
                    name="contact"
                    id="contact"
                    label="Do you spend time around anyone considered high risk, such as elderly with co-morbidities or immunocompromised family members?"
                    ref={register}
                    style={{ paddingLeft: '0' }}
                  />
                </div>
                <div className="requested-actions">
                  <div className="form-title">7. Requested Actions:</div>
                  <Form.Check
                    type="switch"
                    name="willing_was"
                    id="willing_was"
                    label="Are you willing to wash or sanitize your hands upon entering my office and post-massage?"
                    style={{ paddingLeft: '0' }}
                    ref={register}
                  />
                  <Form.Check
                    type="switch"
                    name="willing_wear"
                    id="willing_wear"
                    label="Are you willing to wear a face mask at all times in my office and during the treatment?"
                    style={{ paddingLeft: '0' }}
                    ref={register}
                  />
                </div>
                <div className="signature"></div>
                <div className="text-center">
                  <Button className="mob-full" type="submit">
                    Next
                  </Button>
                </div>
              </Form>
            )}
            {pageKey == 'next' && (
              <Form
                className="waiver-form consent-form-main-wrapper"
                onSubmit={handleWaiverSubmit(onWaiverSubmit)}
              >
                <h4 className="consent-main-title">
                  Suplementary Consent Form - COVID-19
                </h4>
                <div className="testing">
                  <div className="d-flex acknowledge-name">
                    <p className="input-paragraph-inline">I, </p>
                    <Input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder=""
                      refProps={waiverRegister}
                      isInvalid={
                        !isEmpty(waivererrors) && !isEmpty(waivererrors.name)
                          ? true
                          : false
                      }
                    />
                    <p className="input-paragraph-inline">, acknowledge that</p>
                    <Input
                      type="text"
                      name="therapistn"
                      className="form-control therapist-covid-name-field"
                      placeholder=""
                      readOnly={true}
                      refProps={waiverRegister}
                      isInvalid={
                        !isEmpty(waivererrors) &&
                        !isEmpty(waivererrors.therapistn)
                          ? true
                          : false
                      }
                    />
                    <p className="input-paragraph-inline">
                      {' '}
                      (the “Therapist”), in
                    </p>
                  </div>
                  <div>
                    <p>
                      returning to work, has confirmed to me that he/she has
                      adhered to all health standards and guidelines set out by
                      the Government of Saskatchewan relating to COVID 19.
                    </p>
                  </div>
                  <div>
                    <p>
                      The Therapist has confirmed to me that they have complied
                      with all hygiene and practice standards imposed by the
                      Massage Therapist Association of Saskatchewan (MTAS).
                      Notwithstanding the Therapist has complied with Personal
                      Protection Equipment requirements and complies with the
                      appropriate guidelines, the Therapist cannot guarantee
                      there will be no contraction of COVID 19 arising out of
                      treatment.
                    </p>
                  </div>
                  <div>
                    <p>
                      This form constitutes a release and waiver of the
                      Therapist from liability should COVID 19 be contracted
                      through treatment. I acknowledge I have been requested to
                      execute this release and it is a condition of my receiving
                      treatment from the Therapist, and failure to execute this
                      Waiver and Release may result in treatment being refused.
                    </p>
                  </div>
                  <ol>
                    <li>
                      I ACKNOWLEDGE and AGREE I understand the nature of the
                      treatment I have requested;
                    </li>
                    <li>
                      I CONFIRM I am not currently showing any symptoms of COVID
                      19, and I have not, to my knowledge, contracted COVID 19,
                      and I am aware of the COVID 19 symptoms.
                    </li>
                    <li>
                      I HEREBY RELEASE, WAIVE and DISCHARGE the Therapist,
                      his/her administrators, employees, officers, agents,
                      successors, heirs and assigns from all liability, actions,
                      demands, and proceedings arising from my contracting COVID
                      19 as a result of my treatment.
                    </li>
                    <li>
                      I ACKNOWLEDGE I have read this Waiver and Release and
                      fully understand its terms and I have signed it freely and
                      without any inducement or assurance of any nature; and I
                      intend it to be a complete and unconditional release of
                      all liability to the greatest extent allowed by law
                      relating to my contracting COVID 19 from treatment. If any
                      portion of this Waiver and Release is held to be invalid,
                      the balance, notwithstanding, shall continue in full force
                      and effect.
                    </li>
                  </ol>
                  <div>
                    <p>
                      This Waiver and Release shall be governed by and construed
                      under the laws of the Province of Saskatchewan.
                    </p>
                  </div>
                  <div className="signature">
                    <div className="row p-3">
                      <Form.Check
                        custom
                        type="checkbox"
                        name="acknowledge"
                        id="acknowledge"
                        label="I understand and accept the above."
                        ref={waiverRegister}
                        isInvalid={
                          !isEmpty(waivererrors) &&
                          !isEmpty(waivererrors.acknowledge)
                            ? true
                            : false
                        }
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      className="mob-full"
                      type="submit"
                      disabled={watchAcknowledge ? false : true}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Container>
        </ConsentFormStyleWrapper>

        {/* Footer Section */}
        <Footer />
      </div>
    </PageLoader>
  );
}
