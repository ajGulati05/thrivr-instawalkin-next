import React, { useState } from 'react';
import Head from 'next/head';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import isEmpty from 'lodash.isempty';
import { emailRegex } from 'util/config';
import PageLoader from 'components/Views/PageLoader';
import { addContactUs } from 'services';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import InputGroup from 'components/Base/InputGroup';
import Footer from 'components/Footer';
import Header from 'components/Header';
import ContactStyleWrapper from './contactUs.style';

const InitialFormData = {
  name: '',
  email: '',
  comment: '',
};
export default function Contact() {
  const loaderCount = useSelector((state) => state.app.loaderCount);

  const [formData, setFormData] = useState({
    ...InitialFormData,
  });

  const [errors, setErrors] = useState({});
  const [isContactSuccess, setContactSuccess] = useState(false);

  const handleChange = async (event) => {
    await setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleBlur = () => {
    validateForm(formData);
  };

  const validateForm = (data) => {
    let errorForm = {};
    Object.keys(data).map((field) => {
      if (!data[field]) {
        errorForm[field] = true;
      } else if (field === 'email') {
        if (!emailRegex.test(data[field])) {
          errorForm[field] = true;
        }
      }
    });
    setErrors(errorForm);
    return errorForm;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let errors = validateForm(formData);

    if (isEmpty(errors)) {
      let response = await addContactUs(formData);
      if (!isEmpty(response) && response.status === 200) {
        setFormData({
          ...InitialFormData,
        });
        setContactSuccess(true);
        setTimeout(() => {
          setContactSuccess(false);
        }, 2100);
      }
    }
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <ContactStyleWrapper>
        <Head>
          <meta
            property="og:title"
            content="Contact Us | Thrivr - On demand massage service in Saskatoon and Regina, Saskatchewan."
          />
          <meta
            property="og:description"
            content="Let’s get in touch! Send us your questions and we’ll respond as soon as possible. Thrivr offers a spa-quality massage experience, allowing you to book highly rated massage therapists within a few clicks."
          />
          <title>Contact Us - Thrivr</title>
        </Head>

        <Header className="header-white" activeLink="Contact" />
        {/* Contact Us Section */}
        <section className="section-content-wrapper contact-us-wrapper">
          <Container>
            <div className="contact-us-content position-relative">
              {/* Alert Success Message */}
              {isContactSuccess && (
                <div className="alert-wrapper">
                  <Alert variant={'success'}>Your message sent</Alert>
                </div>
              )}
              <div className="contact-detail question">
                <h3 className="title">Questions?</h3>
                <p>
                  Didn&apos;t find what you were looking for in our FAQ? Send us
                  your queries and we&apos;ll get back to you.
                </p>
              </div>
              <div className="contact-detail contact-form">
                <Form onSubmit={onSubmit} noValidate>
                  <InputGroup isCustom={true}>
                    <Input
                      type={'text'}
                      name="name"
                      value={formData.name}
                      placeholder="Your Name"
                      isInvalid={!isEmpty(errors) && errors.name ? true : false}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </InputGroup>

                  <InputGroup
                    inputProps={{
                      type: 'email',
                      name: 'email',
                      value: formData.email,
                      placeholder: 'Email',
                      isInvalid:
                        !isEmpty(errors) && errors.email ? true : false,
                      onChange: handleChange,
                      onBlur: handleBlur,
                    }}
                  />
                  <InputGroup isCustom={true}>
                    <Input
                      as={'textarea'}
                      className={cx('form-control textarea', {
                        'is-invalid':
                          !isEmpty(errors) && errors.comment ? true : false,
                      })}
                      name="comment"
                      value={formData.comment}
                      rows={'7'}
                      placeholder="Your message to us"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </InputGroup>
                  <Button
                    className="mob-full"
                    varient="secondary"
                    type="submit"
                  >
                    Send
                  </Button>
                </Form>
              </div>
              <div className="contact-detail support">
                <h4 className="sub-title">Support</h4>
                <a href="mailto:support@thrivr.ca">support@thrivr.ca</a>
              </div>
              <div className="contact-detail inquiries">
                <h4 className="sub-title">Media Inquiries</h4>
                <a href="mailto:team@thrivr.ca">team@thrivr.ca</a>
              </div>
              <div className="contact-detail phone">
                <h4 className="sub-title">Phone</h4>
                <a href="tel:+18559432256">+1 855-943-2256</a>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer Section */}
        <Footer />
      </ContactStyleWrapper>
    </PageLoader>
  );
}
