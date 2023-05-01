import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import { emailRegex } from 'util/config';
import PageLoader from 'components/Views/PageLoader';
import { ctaRecordLogger, getCityBanner } from 'services';
import isEmpty from 'lodash.isempty';
import InputGroup from 'components/Base/InputGroup';
import Footer from 'components/Footer';
import Header from 'components/Header';
import axios from 'axios';
import FaqComponent from 'components/Views/Common/faq';
import DescriptionComponent from 'components/Views/Common/description';
import Carousel, { CarouselItem } from 'components/Base/Carousel';
import { handleTimekitModal } from 'redux/app/actions';
import TherapistStyleWrapper from './forPartner.style';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MetricsBanner from 'containers/MetricsBanner';

const EmailSuccessMessage = () => (
  <div className="success-submit-wrap">
    <p>Thank you for request, we will be in touch with you soon.</p>
  </div>
);

export default function Therapists() {
  const timekitWidget = useSelector((state) => state.app.timekitWidget);
  const loaderCount = useSelector((state) => state.app.loaderCount);
  let dispatch = useDispatch();
  const [bookEmail, setBookEmail] = useState({ value: '', touched: false });
  const [metricsData, setMetricsData] = useState();
  const [startedEmail, setStartedEmail] = useState({
    value: '',
    touched: false,
  });

  const [bookSuccess, setBookSuccess] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let metricsRes = await getCityBanner();
    if (metricsRes.status === 200 && !isEmpty(metricsRes.data)) {
      setMetricsData(metricsRes.data.data);
    }
  };

  const handleBookDemoClick = (data) => {
    window.dataLayer.push({
      event: 'demoClick',
      event_label: data,
      event_category: 'clicks',
      data: null,
    });
  };

  const handleBookSubmit = (event) => {
    event.preventDefault();
    if (!bookEmail.value || !emailRegex.test(bookEmail.value)) {
      setBookEmail({ ...bookEmail, touched: true });
      return;
    }
    setBookSuccess(true);
    router.push(`/request-demo?email=${bookEmail?.value}`);
    setTimeout(() => {
      setBookSuccess(false);
      setBookEmail({ value: '', touched: false });
    }, 3000);
  };

  const handleBookChange = (event) => {
    let value = event.target.value;
    if (/@/.test(value)) {
      ctaRecordLogger({ email: value, type: 'L' });
    }
    setBookEmail({ ...bookEmail, value, touched: true });
  };

  const handleBookBlur = () => {
    setBookEmail({ ...bookEmail, touched: true });
  };

  const handleStartedSubmit = (event) => {
    event.preventDefault();
    if (!startedEmail.value || !emailRegex.test(startedEmail.value)) {
      setStartedEmail({ ...startedEmail, touched: true });
      return;
    }
    setBookSuccess(true);
    setTimeout(() => {
      setBookSuccess(false);
      setStartedEmail({ value: '', touched: false });
    }, 2200);
  };

  const handleStartedChange = (event) => {
    let value = event.target.value;
    if (/@/.test(value)) {
      ctaRecordLogger({ email: value, type: 'L' });
    }
    setStartedEmail({ ...startedEmail, value, touched: true });
  };

  const handleStartedBlur = () => {
    setStartedEmail({ ...startedEmail, touched: true });
  };

  const handleRequestDemoClick = () => {
    dispatch(handleTimekitModal(true, timekitWidget));
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <TherapistStyleWrapper>
        <Head>
          <meta
            property="og:title"
            content="Thrivr - {What would we call our RMT-side software??} {NTD:Online marketplace and practice management software for registered massage therapists"
          />
          <meta
            property="og:description"
            content="Expand and enhance your practice through our online marketplace and practice management software for registered massage therapists "
          />
          <title>
            Grow your massage practice with Thrivr&apos;s solution for getting
            bookings and filling up spots.
          </title>
        </Head>

        <Header className="header-white" activeLink="For therapist" />

        {/* Banner Section */}
        <section className="tan-banner d-flex">
          <div className="container-fluid m-auto">
            <div className="row">
              <div className="col-md-5 m-auto">
                <div className="banner-details">
                  <h2 className="main-title">
                    <span>Get</span> Clients.
                    <br />
                    <span>Get</span> Booked. <span>Get</span> Paid.
                  </h2>
                  <p>
                    Keep your calendar full with Thrivr: A solution for RMTs to
                    fill empty appointment slots effortlessly.
                  </p>
                  <Form
                    className="form-inline"
                    noValidate
                    onSubmit={handleBookSubmit}
                  >
                    <InputGroup className="book-demo-input" isCustom={true}>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        name="bookEmail"
                        value={bookEmail.value}
                        onChange={handleBookChange}
                        onBlur={handleBookBlur}
                        isInvalid={
                          bookEmail.touched &&
                          (!bookEmail.value ||
                            !emailRegex.test(bookEmail.value))
                            ? true
                            : false
                        }
                      />
                      <Button type="submit">Book A Demo</Button>
                    </InputGroup>
                  </Form>
                  {bookSuccess && <EmailSuccessMessage />}
                </div>
              </div>
              <div className="col-md-7 m-auto text-right img-box">
                <img
                  src="/images/big_pink_circle.png"
                  className="w-100 img-background"
                />
                <img
                  src="/images/ipad_image.png"
                  className="w-100 img-desktop d-none d-sm-block"
                />
                <img src="/images/phone_image.png" className="img-mobile" />
              </div>
            </div>
          </div>
        </section>

        {/* City Banner Section */}
        {!isEmpty(metricsData) && (
          <MetricsBanner metricsBannerData={metricsData} />
        )}

        {/* Video Section */}
        {/* commented out temporarily */}
        {/* <section className="video-section">
          <Container className="text-center">
            <h3 className="title">How does Instawalkin work?</h3>
            <div className="video">
              <iframe
                width="600"
                height="350"
                src="https://www.youtube.com/embed/1dcN1iETv_k"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </Container>
        </section> */}

        {/* Description Section */}
        <DescriptionComponent>
          <div className="row div-wrapper">
            <div className="col-sm-6 m-auto">
              <div className="inner-div m-auto">
                <h3 className="title">
                  Build schedules for your practice{' '}
                  <span className="pink-text">in a few clicks</span>
                </h3>
                <p>
                  Our software automatically pulls your openings from your
                  existing scheduling software (and if you’re not using one,
                  we’ll provide it for you). Your services are booked online and
                  added directly to your calendar — easy.
                </p>
              </div>
            </div>
            <div className="col-sm-6 text-center">
              <img
                src="/images/build_your_schedule.png"
                className="home-img"
                alt="Build Your Registered Massage Therapist Practice Schedule"
              />
            </div>
          </div>
          <div className="row div-wrapper flex-row-reverse">
            <div className="col-sm-6 m-auto">
              <div className="inner-div m-auto">
                <h3 className="title">
                  Build a profile, <span className="pink-text">get listed</span>
                </h3>
                <p>
                  Getting listed allows potential customers to discover you when
                  searching for the modalities you provide. With a premium
                  account, prospective clients can book directly from our
                  webpage.
                </p>
              </div>
            </div>
            <div className="col-sm-6 text-center">
              <img
                src="/images/build_your_profile.png"
                className="home-img"
                alt="Build Your Registered Massage Therapist Practice Profile"
              />
            </div>
          </div>
          <div className="row div-wrapper">
            <div className="col-sm-6 m-auto">
              <div className="inner-div m-auto">
                <h3 className="title">
                  Reach More <span className="pink-text">Clients</span>
                </h3>
                <p>
                  You’ll be added to a list of the best RMTs in Regina and
                  Saskatoon. Clients who use our service are actively looking
                  for an available, trustworthy massage therapist (that’s you).
                </p>
              </div>
            </div>
            <div className="col-sm-6 text-center">
              <img
                src="/images/reach_more_customers.png"
                className="home-img"
                alt="Get more clients for your massage therapy practice"
              />
            </div>
          </div>
        </DescriptionComponent>

        {/* Download Section */}
        <section className="download-section email-section">
          <Container className="text-center">
            <h3 className="title">
              Enter your email address to start your free trial today
            </h3>
            <div>
              <Input
                type="email"
                placeholder="Your email…"
                name="startedEmail"
                value={startedEmail.value}
                onChange={handleStartedChange}
                onBlur={handleStartedBlur}
                isInvalid={
                  startedEmail.touched &&
                  (!startedEmail.value || !emailRegex.test(startedEmail.value))
                    ? true
                    : false
                }
              />
              <Button varient="primary" onClick={handleStartedSubmit}>
                Get started
              </Button>
              {bookSuccess && <EmailSuccessMessage />}
            </div>
          </Container>
        </section>

        {/* Review Section */}
        {/* <section className="review-section">
          <Container className="text-center">
            <h3 className="title">
              What registered massage therapists are saying
            </h3>
            <Carousel>
              {ReviewTherapistArrConstant.map((review, index) => (
                <CarouselItem key={index}>
                  <p>{review.description}</p>
                  <div className="img">
                    <img src={review.imgSrc} />
                  </div>
                  <div className="name">{review.name}</div>
                </CarouselItem>
              ))}
            </Carousel>
          </Container>
        </section>*/}

        {/* Pricing Section */}
        <section className="pricing-section" id="pricing">
          <Container>
            <h3 className="title text-center">Pricing</h3>
            <div className="row">
              <div className="col-sm-6 col-md-5 ml-auto box-wrapper">
                <div className="box">
                  <div className="title">Listing</div>
                  <div className="pkg">Free</div>
                  <ul className="list-unstyled">
                    <li>Free Profile Listing</li>
                    <li>Reviews</li>
                    <li>Analytics</li>
                    <li>24/7 Support</li>
                  </ul>
                  <div className="text-center box-btn">
                    <Link href="/request-demo">
                      <Button
                        onClick={() => handleBookDemoClick('listing')}
                        varient="primary"
                      >
                        Book A 1-On-1 Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-md-5 mr-auto box-wrapper">
                <div className="box box-dark">
                  <div className="title">Premium</div>
                  <div className="pkg">
                    3% <span>per transaction</span>
                  </div>
                  <span>1st Month is on us</span>
                  <ul className="list-unstyled">
                    <li>Listing features included</li>
                    <li>Scheduling Software</li>
                    <li>Calendar Sync with Google and Outlook (both ways)</li>
                    <li>Intake and COVID-19 Forms</li>
                    <li>Online Payments (2.9% + 30 cents processing fee)</li>
                    <li>Re-scheduling And Cancellation Fees</li>
                    <li>Free Ads on Google and Facebook</li>
                    <li>Automated Receipts</li>
                    <li>24/7 Support</li>
                  </ul>
                  <div className="text-center box-btn">
                    <Link href="/request-demo">
                      <Button
                        varient="primary"
                        onClick={() => handleBookDemoClick('premium')}
                      >
                        Book A 1-On-1 Demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Faq Section */}
        <FaqComponent
          faqs={FaqArrConstant}
          title={'Frequently Asked Questions'}
        />

        {/* Footer Section */}
        <Footer />
      </TherapistStyleWrapper>
    </PageLoader>
  );
}

const ReviewTherapistArrConstant = [
  {
    description: `Love this app. Super simple to use, and I got in right away
    when I needed too. I usually never find quick last minute
    appointments. This app made it foolproof for me to schedule
    one and processed my payment within the hour. Will definitely
    be using this app again!`,
    imgSrc: `images/review.jpg`,
    name: `Name Surname`,
  },
  {
    description: `Love this app. Super simple to use, and I got in right away
    when I needed too. I usually never find quick last minute
    appointments. This app made it foolproof for me to schedule
    one and processed my payment within the hour. Will definitely
    be using this app again!`,
    imgSrc: `images/review.jpg`,
    name: `Name Surname`,
  },
  {
    description: `Love this app. Super simple to use, and I got in right away
    when I needed too. I usually never find quick last minute
    appointments. This app made it foolproof for me to schedule
    one and processed my payment within the hour. Will definitely
    be using this app again!`,
    imgSrc: `images/review.jpg`,
    name: `Name Surname`,
  },
];

const FaqArrConstant = [
  {
    key: '0',
    title: `How does Thrivr work?`,
    description: (
      <>
        Thrivr integrates with 95% of scheduling software, so that clients can
        book an appointment with you directly through the Thrivr app. Since
        clients are searching by time availability, type of service, and
        location rather than by massage clinic, you’ll appear in more search
        results and get more bookings. If a client selects one of your available
        appointment slots, we close that time on the Thrivr app.
      </>
    ),
  },
  {
    key: '1',
    title: `What if I don’t have scheduling software?`,
    description: (
      <>
        If you don’t have scheduling software, we’ll provide it for you—no
        effort required on your end.
      </>
    ),
  },
  {
    key: '2',
    title: `How do I get paid?`,
    description: (
      <>
        Thrivr therapists are paid out via direct deposit on a semi-monthly
        basis (on the first business day after the 15th and the first business
        day after the 30th or 31st).
      </>
    ),
  },
  {
    key: '3',
    title: `Will I receive tips from my clients?`,
    description: (
      <>
        Yes! You will receive 100% of your tips, which will be deposited along
        with your semi-monthly payments.
      </>
    ),
  },
  {
    key: '4',
    title: `Can I add someone else to my account?`,
    description: (
      <>
        Yes. If you would like to give a receptionist access to your account, we
        can do that easily.
      </>
    ),
  },
  {
    key: '5',
    title: `What’s the pricing plan like for Thrivr?`,
    description: (
      <>
        You can try Thrivr premium free for 1 month and then its 3% per
        transaction or you can try Thrivr Listing for free.
      </>
    ),
  },
  {
    key: '6',
    title: `What happens when a client reschedules or cancels their appointment?`,
    description: (
      <>
        <p>
          If a client reschedules their appointment within 60 minutes of the
          scheduled start time of that appointment, you will be paid 15% of the
          total original appointment rate.
        </p>
        <p>
          If a client cancels their appointment within 60 minutes of the
          scheduled appointment start time, you will be paid 25% of the total
          original appointment rate.
        </p>
      </>
    ),
  },
  {
    key: '7',
    title: `How does Thrivr integrate with my current scheduling software?`,
    description: (
      <>
        Once you integrate, Thrivr will know when you have an open slot and when
        you are booked, so that available times can be served up to clients. For
        some scheduling softwares, we can actually close the spot on your
        calendar once a client books that time slot. For others, we will
        manually book an appointment slot once it’s scheduled, or you can
        manually book it.
      </>
    ),
  },
  {
    key: '8',
    title: `How will I get notified when a new appointment is scheduled through Thrivr?`,
    description: <>You may choose to be notified via text, email or both.</>,
  },
  {
    key: '9',
    title: `Is there a buffer period of how soon a client can book an appointment with me?`,
    description: (
      <>
        Yes, it’s currently set to 1 hour. You will soon be able to set your own
        buffer window..
      </>
    ),
  },
  {
    key: '10',
    title: `Is there a buffer period after a massage?`,
    description: <>Yes and you can set your own buffer period.</>,
  },
];
