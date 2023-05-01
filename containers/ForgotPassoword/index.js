import React, { useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import { forgotPassword } from 'redux/auth/actions';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';

const InitialFormData = {
  email: '',
};
const schema = yup.object().shape({
  email: yup.string().email().required(),
});
export default function ForgotPassword() {
  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    defaultValues: {
      ...InitialFormData,
    },
  });
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const dispatch = useDispatch();

  const [confirmMessage, setConfirmMessage] = useState('');
  const errorBackend = useSelector((state) => state.auth.error);

  const redirectSignup = () => {
    Router.push('/signup');
  };
  const onSubmit = async (data) => {
    let payload = {
      ...data,
    };
    let { status, message } = await dispatch(forgotPassword(payload));
    if (status) {
      setConfirmMessage(message);
      setTimeout(() => {
        setConfirmMessage('');
      }, 3000);
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper forgot-password-content">
        <Head>
          <title>Forgot Password - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header className="form-header" />

        {/* Banner Section */}
        <section className="banner-wrapper d-flex">
          <Container className="m-auto position-relative">
            {/* Alert Success Message */}
            <AnimatePresence>
              {!isEmpty(confirmMessage) && (
                <motion.div
                  className="alert-success-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant={'primary'}>{confirmMessage}</Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="form-details">
              <h2 className="main-title d-none d-sm-none d-md-block">
                Easiest way to book a massage
              </h2>
              <Link href="/login">
                <a className="back-arrow d-block d-md-none">
                  <img src="/images/left.svg" />
                </a>
              </Link>
              <div className="form-wrapper">
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
                <Form className="login" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-title">Forgot Password</div>
                  <SeperatorStyle />
                  <InputGroup isCustom>
                    <Input
                      name="email"
                      placeholder="Email"
                      refProps={register}
                      isInvalid={!isEmpty(errors) && !isEmpty(errors.email)}
                    />
                  </InputGroup>

                  <Button className="mob-full" type="submit">
                    Send
                  </Button>
                  <div className="account-opt">
                    Don’t have an account?
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
