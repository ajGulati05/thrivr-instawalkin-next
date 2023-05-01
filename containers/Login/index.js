import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import PageLoader from 'components/Views/PageLoader';
import isEmpty from 'lodash.isempty';
import { emailRegex } from 'util/config';
import { login, socialLogin } from 'redux/auth/actions';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';

export default function Login() {
  const { register, handleSubmit, errors } = useForm();
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const googleOauthRef = useSelector((state) => state.auth.googleOauthRef);
  const fbOauthRef = useSelector((state) => state.auth.fbOauthRef);
  const errorBackend = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const [redirectFrom, setRedirectFrom] = useState('/');
  let queryRedirect = '/';
  const router = useRouter();

  if (!isEmpty(router) && !isEmpty(router.query) && router.query.redirectFrom) {
    if (router.query.redirectFrom === '/login') {
      queryRedirect = '/';
    } else {
      queryRedirect = encodeURI(router.query.redirectFrom);
    }
  }

  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
    }
  }, []);

  const onSubmit = async (data) => {
    let payload = {
      ...data,
      grant_type: 'password',
      scope: '*',
      customProvider: 'usersapi',
    };
    await dispatch(login(payload, redirectFrom));
  };

  const handleSocialSign = async (key) => {
    if (key === 'google') {
      if (!isEmpty(googleOauthRef)) {
        let resp = await googleOauthRef.signIn();
        if (resp) {
          await dispatch(
            socialLogin(
              {
                provider: 'google',
                access_token: resp.wc.access_token,
              },
              redirectFrom
            )
          );
        }
      }
    } else {
      if (!isEmpty(fbOauthRef)) {
        fbOauthRef.login(async function (response) {
          await dispatch(
            socialLogin(
              {
                provider: 'facebook',
                access_token: response.authResponse.accessToken,
              },
              redirectFrom
            )
          );
        });
      }
    }
  };
  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <div className="content-wrapper">
        <Head>
          <title>Login - Thrivr</title>
        </Head>

        {/* Header Section */}
        <Header activeLink="Login" className="form-header" />

        {/* Banner Section */}
        <section className="banner-wrapper d-flex">
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
                Easiest way to book a massage
              </h2>
              <a
                className="back-arrow d-block d-md-none"
                onClick={() => router.push(`${redirectFrom}`)}
              >
                <img src="/images/left.svg" />
              </a>
              <div className="form-wrapper">
                <Form className="login" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-title">Log in</div>
                  {/*   <div className="sign-options">
                    <a className="fb" onClick={() => handleSocialSign('fb')}>
                      <img src="/images/fb.svg" />
                      <span>Log in with Facebook</span>
                    </a>
                    <a
                      className="gmail"
                      onClick={() => handleSocialSign('google')}
                    >
                      <img src="/images/google.svg" />
                      <span>Log in with Google</span>
                    </a>
                  </div>*/}
                  <SeperatorStyle />
                  <InputGroup isCustom={true}>
                    <Input
                      type="text"
                      name="email"
                      title="Email"
                      placeholder="Email"
                      refProps={register({
                        required: true,
                        pattern: emailRegex,
                      })}
                      isInvalid={
                        !isEmpty(errors) && !isEmpty(errors.email)
                          ? true
                          : false
                      }
                    />
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
                  </InputGroup>
                  <Link href="/forgot-password">
                    <a className="forgot-password-link">Forgot Password?</a>
                  </Link>
                  <Button className="mob-full" type="submit">
                    Log in
                  </Button>
                  <div className="account-opt">
                    Don’t have an account?{' '}
                    <Link href={'/signup?redirectFrom=' + queryRedirect || '/'}>
                      <a>Sign up</a>
                    </Link>
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
