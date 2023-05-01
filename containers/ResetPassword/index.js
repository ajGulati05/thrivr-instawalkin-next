import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { motion, AnimatePresence } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import { passwordRegex } from 'util/config';
import { passwordReset } from 'redux/auth/actions';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import * as yup from 'yup';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';

const ResetPasswordschema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter the email')
    .email('Please enter valid email'),

  password: yup
    .string()
    .required('Please enter the password')
    .matches(passwordRegex, 'Password should be minimun 6 characters'),
});

export default function ResetPassword() {
  const { register, handleSubmit, errors } = useForm({
    validationSchema: ResetPasswordschema,
  });
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const errorBackend = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const [redirectFrom, setRedirectFrom] = useState('/');
  const router = useRouter();

  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
    }
  }, []);

  const redirectSignup = () => {
    Router.push('/signup');
  };

  const onSubmit = async (data) => {
    let payload = {
      ...data,
      token: router.query.token ? router.query.token : null,
    };
    await dispatch(passwordReset(payload, redirectFrom));
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Reset Password - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="form-header" />

        {/* Banner Section */}
        <section className="banner-wrapper d-flex">
          <Container className="m-auto position-relative">
            {/* Alert Error Message */}
            <AnimatePresence>
              {!isEmpty(errorBackend) &&
                typeof errorBackend === 'object' &&
                errorBackend !== null && (
                  <motion.div
                    className="alert-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0 }}
                  >
                    {Object.values(errorBackend).map((error) =>
                      error.map((field) => (
                        <Alert variant={'error'} key={field}>
                          {field}
                        </Alert>
                      ))
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
            {/* Alert Error Message */}
            <AnimatePresence>
              {!isEmpty(errorBackend) &&
                typeof errorBackend === 'string' &&
                errorBackend !== null && (
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
                Easiest way to book a massage
              </h2>
              <a className="back-arrow d-block d-md-none" href="#">
                <img src="/images/left.svg" />
              </a>
              <div className="form-wrapper">
                <Form className="login" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-title">Reset Password</div>
                  <SeperatorStyle />
                  <InputGroup isCustom={true}>
                    <Input
                      type="text"
                      name="email"
                      title="Email"
                      placeholder="Email"
                      refProps={register}
                      isInvalid={
                        !isEmpty(errors) && !isEmpty(errors.email)
                          ? true
                          : false
                      }
                    />
                    {!isEmpty(errors) && errors.email && (
                      <Form.Control.Feedback type="invalid">
                        {errors.email.message}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                  <InputGroup isCustom={true}>
                    <Input
                      type="password"
                      name="password"
                      title="Password"
                      placeholder="Password"
                      refProps={register({ required: true })}
                      isInvalid={
                        !isEmpty(errors) && !isEmpty(errors.password)
                          ? true
                          : false
                      }
                    />
                    {!isEmpty(errors) && errors.password && (
                      <Form.Control.Feedback type="invalid">
                        {errors.password.message}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>

                  <Button className="mob-full" type="submit">
                    Confirm
                  </Button>
                  <div className="account-opt">
                    Don’t have an account?{' '}
                    <a onClick={redirectSignup}>Sign up</a>
                  </div>
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
