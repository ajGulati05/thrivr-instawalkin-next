import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import InputMask from 'react-input-mask';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import cx from 'classnames';
import isEmpty from 'lodash.isempty';
import { phoneRegex } from 'util/config';
import PageLoader from 'components/Views/PageLoader';
import Button from 'components/Base/Button';
import { signup, socialLogin } from 'redux/auth/actions';
import Input from 'components/Base/Input';
import InputGroup from 'components/Base/InputGroup';
import { SeperatorStyle } from 'components/StyleComponent';
import Footer from 'components/Footer';
import Header from 'components/Header';
import SignupFormStyleWrapper from './signup.style';

const InitialFormData = {
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  phone: '',
};
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  phone: yup.string().required().matches(phoneRegex),
});
export default function Signup() {
  const dispatch = useDispatch();
  const loaderCount = useSelector((state) => state.app.loaderCount);

  const errorBackend = useSelector((state) => state.auth.error);
  const googleOauthRef = useSelector((state) => state.auth.googleOauthRef);
  const fbOauthRef = useSelector((state) => state.auth.fbOauthRef);
  const router = useRouter();
  let queryRedirect = '/';
  const [formComponentFlag, setFormComponentFlag] = useState(false);
  const [redirectFrom, setRedirectFrom] = useState('/');
  const { register, handleSubmit, control, errors } = useForm({
    validationSchema: schema,
    defaultValues: {
      ...InitialFormData,
    },
  });

  useEffect(() => {
    if (!isEmpty(router) && !isEmpty(router.query)) {
      router.query.redirectFrom
        ? setRedirectFrom(router.query.redirectFrom)
        : null;
    }
  }, []);

  if (!isEmpty(router) && !isEmpty(router.query) && router.query.redirectFrom) {
    if (router.query.redirectFrom === '/login') {
      queryRedirect = '/';
    } else {
      queryRedirect = router.query.redirectFrom;
    }
  }
  const onSubmit = async (data) => {
    event.preventDefault();
    if (!formComponentFlag) {
      setFormComponentFlag(true);
    }
    let payload = {
      ...data,
      grant_type: 'password',
      scope: '*',
      customProvider: 'usersapi',
    };
    await dispatch(signup(payload, redirectFrom));
  };
  const handleChange = () => {
    if (!formComponentFlag) {
      setFormComponentFlag(true);
    }
  };

  const handleSocialSign = async (key) => {
    if (key === 'google') {
      /* FBP signup */
      // window.fbq('trackCustom', 'signup', {
      //   actionItem: 'button',
      //   data: null,
      //   event_label: 'google',
      //   event_category: 'impressions',
      // });

      /* Gtag signup */
      // window.gtag('event', 'signup', {
      //   event_category: 'impressions',
      //   event_label: 'google',
      //   actionItem: 'button',
      //   data: null,
      // });

      if (!isEmpty(googleOauthRef)) {
        let resp = await googleOauthRef.signIn();
        if (resp) {
          await dispatch(
            socialLogin(
              {
                provider: 'google',
                access_token: resp.wc.access_token,
              },
              queryRedirect
            )
          );
        }
      }
    } else {
      /* FBP signup */
      // window.fbq('trackCustom', 'signup', {
      //   actionItem: 'button',
      //   data: null,
      //   event_label: 'facebook',
      //   event_category: 'impressions',
      // });

      /* Gtag signup */
      // window.gtag('event', 'signup', {
      //   event_category: 'impressions',
      //   event_label: 'facebook',
      //   actionItem: 'button',
      //   data: null,
      // });
      if (!isEmpty(fbOauthRef)) {
        fbOauthRef.login(async function (response) {
          await dispatch(
            socialLogin(
              {
                provider: 'facebook',
                access_token: response.authResponse.accessToken,
              },
              queryRedirect
            )
          );
        });
      }
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <Head>
        <title>Signup - Thrivr</title>
      </Head>
      <div className="content-wrapper signup-content">
        {/* Header Section */}
        <Header className="form-header" />

        {/* Banner Section */}
        <section className="alt-banner-wrapper banner-wrapper d-flex">
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
            <div className="form-details">
              <h2 className="main-title d-none d-sm-none d-md-block">
                Easiest way to book a massage
              </h2>
              <a
                className="back-arrow d-block d-md-none"
                onClick={() => router.push(`${queryRedirect}`)}
              >
                <img src="/images/left.svg" />
              </a>
              <div className="form-wrapper">
                <SignupFormStyleWrapper
                  className={cx({ email: formComponentFlag })}
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <AnimatePresence>
                    {!formComponentFlag ? (
                      <motion.div
                        key={'form-component-true-key'}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="form-title">Sign up</div>
                        {/*  <div className="sign-options">
                          <a
                            onClick={() => handleSocialSign('fb')}
                            className="fb"
                          >
                            <img src="/images/fb.svg" />
                            <span>Sign up with Facebook</span>
                          </a>
                          <a
                            onClick={() => handleSocialSign('google')}
                            className="gmail"
                          >
                            <img src="/images/google.svg" />
                            <span>Sign up with Google</span>
                          </a>
                        </div>*/}
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="form-title">Sign up</div>
                        {/*    <div className="sign-options">
                          Sign up using{' '}
                          <a onClick={() => handleSocialSign('fb')}>Facebook</a>{' '}
                          or{' '}
                          <a onClick={() => handleSocialSign('google')}>
                            Google
                          </a>
                        </div>*/}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SeperatorStyle />
                  {/* Input Group */}
                  <InputGroup isCustom>
                    <Input
                      name="email"
                      placeholder="Email"
                      refProps={register}
                      isInvalid={!isEmpty(errors) && !isEmpty(errors.email)}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {formComponentFlag && (
                    <motion.div
                      key={'form-input-true-key'}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0 }}
                    >
                      <InputGroup isCustom>
                        <Input
                          name="firstname"
                          placeholder="First name"
                          refProps={register}
                          isInvalid={
                            !isEmpty(errors) && !isEmpty(errors.firstname)
                          }
                          onChange={handleChange}
                        />
                      </InputGroup>
                      <InputGroup isCustom>
                        <Input
                          name="lastname"
                          placeholder="Last name"
                          refProps={register}
                          isInvalid={
                            !isEmpty(errors) && !isEmpty(errors.lastname)
                          }
                          onChange={handleChange}
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
                    </motion.div>
                  )}
                  <InputGroup isCustom>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      refProps={register}
                      isInvalid={!isEmpty(errors) && !isEmpty(errors.password)}
                      onChange={handleChange}
                    />
                  </InputGroup>

                  <Button className="mob-full" type="submit">
                    Sign Up
                  </Button>
                  <div className="account-opt">
                    Already have an account?{' '}
                    <Link href={'/login?redirectFrom=' + queryRedirect || '/'}>
                      <a>Log in</a>
                    </Link>
                  </div>
                </SignupFormStyleWrapper>
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
