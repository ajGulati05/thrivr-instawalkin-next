import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import { getEmailSignedUrl } from 'redux/app/actions';
import Button from 'components/Base/Button';
import CustomModal from 'components/Base/Modal';
import qs from 'qs';
import { consentIntakeForm } from 'redux/app/actions';

export default function ThrivrFormFlows() {
  // States
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const dispatch = useDispatch();
  const router = useRouter();
  let [modalConfirmShow, setModalConfirmShow] = useState(false);
  let [modalData, setModalData] = useState({});
  let [bookData, setBookData] = useState({});

  // Mount
  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      fetchEmailRes();
    }
  }, []);

  const fetchEmailRes = async () => {
    let payload = {
      url: `expires=${router?.query?.expires}&param=${router?.query?.param}&signature=${router?.query?.signature}`,
    };
    const { data, status } = await dispatch(getEmailSignedUrl(payload));
    if (status) {
      setModalConfirmShow(true);
      setModalData(data?.data);
      if (data?.data?.['covid-form']) {
        const urlData = qs.parse(data?.data?.['covid-form']?.covidFormAPIUrl, {
          ignoreQueryPrefix: true,
        });
        setBookData({
          therapist_name: urlData.therapist_name,
          booking_slug: router?.query?.param,
        });
      }
    }
  };

  // Consent the Intake Form
  const handleRedirectOrder = async () => {
    let payload = {
      url: modalData['intake-form']?.intakeFormAPIUrl,
      data: {
        modifier: 'C',
      },
    };
    const { status } = await dispatch(consentIntakeForm(payload));
    if (status) {
      router.push({
        pathname: '/consent-form',
        query: {
          covid: JSON.stringify(modalData['covid-form']),
          booking: router?.query?.param,
          book_data: JSON.stringify({
            therapist_name: bookData?.therapist_name,
          }),
        },
      });
    }
  };

  const handleRedirectIntakeUpdate = async () => {
    const query = new URLSearchParams(
      modalData?.['intake-form']?.intakeFormAPIUrl
    );

    sessionStorage.clear();

    sessionStorage.setItem(
      router?.query?.param,
      JSON.stringify(modalData?.['intake-form']?.intakeForm ?? {})
    );

    router.push({
      pathname: `/intake-form/${query.get('form')}`,

      query: {
        intake: modalData?.['intake-form']?.intakeFormAPIUrl,
        covid: JSON.stringify(modalData?.['covid-form']),
        booking: router?.query?.param,
        auth: false,
        book_data: JSON.stringify({
          therapist_name: bookData?.therapist_name,
        }),
      },
    });
  };

  const handleRedirect = async (type) => {
    const query = new URLSearchParams(
      modalData?.['intake-form']?.intakeFormAPIUrl
    );

    sessionStorage.clear();

    sessionStorage.setItem(
      router?.query?.param,
      JSON.stringify(modalData?.['intake-form']?.intakeForm ?? {})
    );

    type == 'intake'
      ? router.push({
          pathname: `/intake-form/${query.get('form')}`,
          query: {
            type: 'Active',
            intake: modalData?.['intake-form']?.intakeFormAPIUrl,
            covid: JSON.stringify(modalData?.['covid-form']),
            booking: router?.query?.param,
            auth: false,
            book_data: JSON.stringify({
              therapist_name: bookData?.therapist_name,
            }),
          },
        })
      : router.push({
          pathname: `/consent-form`,
          query: {
            covid: JSON.stringify(modalData?.['covid-form']),
            booking: router?.query?.param,
            book_data: JSON.stringify({
              therapist_name: bookData?.therapist_name,
            }),
          },
        });
  };

  const handleRedirectNewIntake = async () => {
    router.push({
      pathname: `/intake-form/new`,
      query: {
        type: 'new',
        auth: false,
        intake: modalData?.['intake-form']?.intakeFormAPIUrl,
        covid: JSON.stringify(modalData?.['covid-form']),
        booking: router?.query?.param,
        book_data: JSON.stringify({
          therapist_name: bookData?.therapist_name,
        }),
      },
    });
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Thrivr Form Flows - Thrivr</title>
        </Head>
        <CustomModal
          show={modalConfirmShow}
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
              {modalData?.['intake-form']?.alreadyConsented
                ? 'Would you like to update your intake form?'
                : modalData?.['intake-form']?.intakeForm
                ? `${'Do you consent to share your intake form with '}${
                    !isEmpty(bookData) ? bookData.therapist_name : 'Therapist'
                  }?`
                : 'Please fill the intake form before your appointment.'}
            </div>
          }
          footer={
            <>
              {modalData?.['intake-form']?.alreadyConsented ? (
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
              ) : modalData?.['intake-form']?.intakeForm ? (
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
            </>
          }
        />
      </div>
    </PageLoader>
  );
}
