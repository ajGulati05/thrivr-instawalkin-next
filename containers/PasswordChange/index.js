import React, { useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import { passwordRegex } from 'util/config';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { resetPassword } from 'redux/auth/actions';
import * as yup from 'yup';
import Alert from 'react-bootstrap/Alert';

const Passwordschema = yup.object({
  currentpassword: yup
    .string()
    .required('Please enter the current password')
    .matches(passwordRegex, 'Current Password should be minimun 6 characters'),
  password: yup
    .string()
    .required('Please enter the password')
    .matches(passwordRegex, 'Password should be minimun 6 characters'),
  confirmpassword: yup
    .string()
    .required('Please enter the confirm password')
    .matches(passwordRegex, 'Confirmpassword should be minimun 6 characters')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function ChangePassword() {
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const dispatch = useDispatch();

  const [isPasswordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordSuccessError, setPasswordSuccessError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState();

  const {
    register: passwordRegister,
    handleSubmit: handleSubmit,
    errors: passwordErrors,
    reset: passwordReset,
  } = useForm({
    validationSchema: Passwordschema,
    defaultValues: {
      currentpassword: '',
      password: '',
      confirmpassword: '',
    },
  });

  const redirectSignup = () => {
    Router.push('/signup');
  };
  const redirectProfile = () => {
    Router.push('/profile');
  };
  const onSubmit = async (data) => {
    let payload = {
      current_password: data.currentpassword,
      password: data.password,
      password_confirmation: data.confirmpassword,
    };
    let { status, error } = await dispatch(resetPassword(payload));
    if (status) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 2100);
      passwordReset({
        currentpassword: '',
        password: '',
        confirmpassword: '',
      });
    }
    if (!isEmpty(error)) {
      if (typeof error === 'object') {
        const newError = Object.values(error);
        console.log(newError);
        setPasswordErrorMessage(newError[0]);
      } else {
        setPasswordErrorMessage(error);
      }
      setPasswordSuccessError(true);
      setTimeout(() => {
        setPasswordSuccessError(false);
      }, 2100);
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Password Change - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="form-header" />

        {/* Banner Section */}
        <section className="banner-wrapper d-flex">
          <Container className="m-auto position-relative">
            {/* Alert Success Message */}
            <AnimatePresence>
              {isPasswordSuccess && (
                <motion.div
                  className="alert-success-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant={'primary'}>
                    Your password has been changed
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Alert Error Message */}
            <AnimatePresence>
              {isPasswordSuccessError && (
                <motion.div
                  className="alert-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant={'error'}>{passwordErrorMessage}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-details">
              <h2 className="main-title d-none d-sm-none d-md-block">
                Easiest way to book a massage
              </h2>
              <a className="back-arrow d-block" onClick={redirectProfile}>
                <img src="/images/left.svg" />
              </a>
              <div className="form-wrapper">
                <Form className="login" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-title ml-auto">Password Change</div>
                  <SeperatorStyle />
                  <InputGroup isCustom>
                    <Input
                      type="password"
                      name="currentpassword"
                      title="Current Password"
                      placeholder="Current Password"
                      refProps={passwordRegister}
                      isInvalid={
                        !isEmpty(passwordErrors) &&
                        !isEmpty(passwordErrors.currentpassword)
                          ? true
                          : false
                      }
                    />
                    {!isEmpty(passwordErrors) &&
                      passwordErrors.currentpassword && (
                        <Form.Control.Feedback type="invalid">
                          {passwordErrors.currentpassword.message}
                        </Form.Control.Feedback>
                      )}
                  </InputGroup>
                  <InputGroup isCustom>
                    <Input
                      type="password"
                      name="password"
                      title="New Password"
                      placeholder="New Password"
                      refProps={passwordRegister}
                      isInvalid={
                        !isEmpty(passwordErrors) &&
                        !isEmpty(passwordErrors.password)
                          ? true
                          : false
                      }
                    />
                    {!isEmpty(passwordErrors) && passwordErrors.password && (
                      <Form.Control.Feedback type="invalid">
                        {passwordErrors.password.message}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                  <InputGroup isCustom>
                    <Input
                      type="password"
                      name="confirmpassword"
                      title="Confirm Password"
                      placeholder="Confirm Password"
                      refProps={passwordRegister}
                      isInvalid={
                        !isEmpty(passwordErrors) &&
                        !isEmpty(passwordErrors.confirmpassword)
                          ? true
                          : false
                      }
                    />
                    {!isEmpty(passwordErrors) &&
                      passwordErrors.confirmpassword && (
                        <Form.Control.Feedback type="invalid">
                          {passwordErrors.confirmpassword.message}
                        </Form.Control.Feedback>
                      )}
                  </InputGroup>

                  <Button className="mob-full" type="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer Section */}
        <Footer />
      </div>
    </PageLoader>
  );
}
