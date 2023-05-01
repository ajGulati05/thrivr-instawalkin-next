import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import { LayoutDiv } from 'components/StyleComponent';
import isEmpty from 'lodash.isempty';
import Button from 'components/Base/Button';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { IntakeFormStyleWrapper } from './intakeForm.style';
import { getIntakeForms } from 'redux/app/actions';

export default function IntakeForm() {
  const { register, handleSubmit, errors } = useForm();
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const errorBackend = useSelector((state) => state.auth.error);
  const intakeFormList = useSelector((state) => state.app.intakeFormList);
  const dispatch = useDispatch();
  const [redirectFrom, setRedirectFrom] = useState('/');
  const [intakeFormData, setIntakeFormData] = useState([]);
  const router = useRouter();

  //   Mount
  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
    }
    getFormData();
  }, []);

  //   Mount
  useEffect(() => {
    !isEmpty(intakeFormList) &&
      intakeFormList.length > 0 &&
      setIntakeFormData(intakeFormList);
  }, [intakeFormList]);

  const getFormData = async () => {
    await dispatch(getIntakeForms());
  };

  const handleClick = (e) => {
    if (e) {
      router.push('/intake-form/[form]', `/intake-form/${e}`);
    } else {
      router.push('/intake-form/[form]', `/intake-form/new`);
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Intake Form - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="header-white" />

        {/* Banner Section */}
        <LayoutDiv>
          <IntakeFormStyleWrapper>
            <Container>
              <div className="intake-form-wrapper order-wrapper">
                <div>
                  <h4 className="sub-title order-title d-inline-block">
                    Intake forms
                  </h4>
                  <Button
                    className="mob-full float-right"
                    varient="secondary"
                    type="submit"
                    onClick={() => handleClick('new')}
                  >
                    Create new
                  </Button>
                </div>
                {intakeFormData.length > 0 && (
                  <table className="upcoming-order table">
                    <thead>
                      <tr>
                        <th className="massage-specialist">Creation date</th>
                        <th className="action">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intakeFormData.map((data, index) => (
                        <tr className="intakedata" key={index}>
                          <td className="massage-specialist">
                            <h5 className="specialist-name">
                              {data.created_at}
                            </h5>
                          </td>
                          <td
                            className="massage-specialist"
                            style={{ width: '25%', textAlign: 'center' }}
                          >
                            <h5 className="specialist-name">
                              {!isEmpty(data.client_guest)
                                ? data.client_guest.name
                                : data.client.name}
                            </h5>
                          </td>
                          <td className="action">
                            <span className="d-md-block">
                              <Button
                                className="reschedule"
                                onClick={() => handleClick(data.id)}
                              >
                                Edit
                              </Button>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
